<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick, computed } from 'vue';
import { createRoot, type Root } from 'react-dom/client';
import { useSpecStore } from '~/store/SpecStore';
import React from 'react';

// Define the shape of our editable attribute objects
interface EditableAttribute {
  name: string;
  value: string;
}

// Set of HTML void elements that cannot have inner content.
const VOID_ELEMENTS = new Set([
  'AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 
  'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'
]);


// 动态导入大型库
const loadLibraries = async () => {
    // ... (rest of the function is unchanged)
    const [
        { default: React },
        { transform },
        antd,
        icons,
        recharts
    ] = await Promise.all([
        import('react'),
        import('@babel/standalone'),
        import('antd'),
        import('@ant-design/icons'),
        import('recharts')
    ]);
    
    return {
        React,
        transform,
        LIBRARY_MAP: {
            antd,
            "@ant-design/icons": icons,
            recharts,
            react: React,
        }
    };
};

interface Props {
    code: string;
}

interface Emits {
    (e: 'spec-click', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const specStore = useSpecStore();
const selectedComponent = computed(() => specStore.selectedComponent);
const selectedSection = computed(() => specStore.selectedSection);

// --- State for Element Inspector ---
const selectedElRef = ref<HTMLElement | null>(null);
// A reactive copy of the selected element's attributes for safe editing
const editableAttributes = ref<EditableAttribute[]>([]);
// A reactive copy of the selected element's inner text for safe editing
const editableInnerText = ref<string | null>(null);

const containerRef = ref<HTMLElement | null>(null);
const loading = ref(true);
let reactRoot: Root | null = null;
let libraries: Awaited<ReturnType<typeof loadLibraries>> | null = null;

// Computed property to check if the selected element is a void element
const isVoidElement = computed(() => {
    if (!selectedElRef.value) return false;
    return VOID_ELEMENTS.has(selectedElRef.value.tagName);
});


function parseImports(code: string, LIBRARY_MAP: any): { imports: Record<string, any>, cleanCode: string } {
    // ... (function is unchanged)
    const importRegex = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?/g;
    const imports: Record<string, any> = {};
    let match;

    while ((match = importRegex.exec(code))) {
        const vars = match[1].trim();
        const lib = match[2] as keyof typeof LIBRARY_MAP;
        const libModule = LIBRARY_MAP[lib];
        if (!libModule) {
            console.warn(`Library not found: ${String(lib)}`);
            continue;
        }
        let defaultName = null;
        let namedList = null;

        if (vars.includes("{")) {
            const [beforeBrace, afterBrace] = vars.split("{", 2);
            const before = beforeBrace.replace(/,$/, "").trim();
            if (before) defaultName = before;
            namedList = "{" + afterBrace;
        } else {
            defaultName = vars;
        }

        if (defaultName) {
            imports[defaultName] = libModule;
        }
        if (namedList) {
            const names = namedList
                .replace(/[{}]/g, "")
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
            names.forEach((name) => {
                const [orig, alias] = name.split(" as ").map((s) => s.trim());
                imports[alias || orig] = libModule[orig as keyof typeof libModule];
            });
        }
    }
    const cleanCode = code
        .replace(importRegex, "")
        .replace(/export\s+default\s+/, "")
        .replace(/export\s+{[^}]*}/, "");
    return { imports, cleanCode };
}

const handleClick = (event: Event): void => {
    // When an element is clicked, update our selectedElRef
    selectedElRef.value = event.target as HTMLElement;
    console.log(selectedElRef.value   )
    const target = (event.target as Element).closest('[data-spec]');
    if (target) {
        event.preventDefault();
        event.stopPropagation();
        const specValue = target.getAttribute('data-spec');
        if (specValue) {
            console.log(specValue);
            emit('spec-click', specValue);
        }
    }
};

/**
 * Handles changes to attributes from the text fields and applies them to the actual DOM element.
 */
const handleAttributeChange = (name: string, newValue: string) => {
  if (selectedElRef.value) {
    selectedElRef.value.setAttribute(name, newValue);
  }
};

/**
 * Handles changes to inner text from the textarea and applies them to the actual DOM element.
 */
const handleInnerTextChange = (newText: string) => {
    if (selectedElRef.value) {
        selectedElRef.value.innerText = newText;
    }
};

// --- Watch for changes to the selected element ---
watch(selectedElRef, (newEl) => {
  if (newEl) {
    // 1. Update attributes
    editableAttributes.value = Array.from(newEl.attributes).map(attr => ({
      name: attr.name,
      value: attr.value
    }));
    // 2. Update inner text
    editableInnerText.value = newEl.innerText;
  } else {
    // If no element is selected, clear everything
    editableAttributes.value = [];
    editableInnerText.value = null;
  }
}, { deep: true });

const renderReact = async (): Promise<void> => {
    // ... (function is unchanged)
    if (!containerRef.value || !props.code || !libraries) return;

    if (reactRoot) {
        reactRoot.unmount();
        reactRoot = null;
    }
    containerRef.value.removeEventListener('click', handleClick);

    try {
        const { imports, cleanCode } = parseImports(props.code, libraries.LIBRARY_MAP);

        const transformResult = libraries.transform(cleanCode, {
            presets: ['react']
        });
        
        if (!transformResult.code) {
            throw new Error('Failed to transform code');
        }

        const scope = { React: libraries.React, ...imports };
        const scopeKeys = Object.keys(scope);
        const scopeValues = Object.values(scope);
        
        const getReactElement = new Function(...scopeKeys, `${transformResult.code}; return App;`);
        const elementToRender = getReactElement(...scopeValues);

        reactRoot = createRoot(containerRef.value);
        reactRoot.render(React.createElement(elementToRender));

        await nextTick();
        containerRef.value.addEventListener('click', handleClick);

    } catch (error) {
        console.error("Failed to render React component:", error);
        if (containerRef.value) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            containerRef.value.innerHTML = `<pre style="color: red;">Error: ${errorMessage}</pre>`;
        }
    }
};

onMounted(async (): Promise<void> => {
    // ... (function is unchanged)
    try {
        libraries = await loadLibraries();
        loading.value = false;
        await renderReact();
    } catch (error) {
        console.error('Failed to load libraries:', error);
        loading.value = false;
    }
});

watch(() => props.code, (): void => {
    // ... (function is unchanged)
    if (!loading.value) {
        renderReact();
    }
});

onBeforeUnmount((): void => {
    // ... (function is unchanged)
    if (reactRoot) {
        reactRoot.unmount();
    }
    if (containerRef.value) {
        containerRef.value.removeEventListener('click', handleClick);
    }
});
</script>

<template>
    <v-row no-gutters>
        <v-col cols="8">
            <div class="rendered-ui" ref="containerRef">
                <div v-if="loading" class="loading-container">
                    <v-progress-circular indeterminate></v-progress-circular>
                    <span class="ml-2">Loading libraries...</span>
                </div>
            </div>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
            <div class="element-inspector">
                <v-card flat>
                    <v-card-title>
                        Element Inspector
                    </v-card-title>
                    <v-card-subtitle v-if="selectedElRef">
                        Tag: &lt;{{ selectedElRef.tagName.toLowerCase() }}&gt;
                    </v-card-subtitle>
                    <v-card-subtitle v-else>
                         Click an element to inspect
                    </v-card-subtitle>

                    <v-card-text>
                        <div v-if="editableAttributes.length > 0">
                            <p class="text-overline">Attributes</p>
                            <div v-for="attr in editableAttributes" :key="attr.name">
                                <v-text-field
                                    :label="attr.name"
                                    v-model="attr.value"
                                    @update:model-value="(newValue) => handleAttributeChange(attr.name, String(newValue))"
                                    variant="outlined"
                                    density="compact"
                                    class="mb-2"
                                >
                                </v-text-field>
                            </div>
                        </div>
                        <div v-else-if="selectedElRef">
                            This element has no attributes.
                        </div>
                         <div v-else>
                            No element selected.
                        </div>

                        <div v-if="selectedElRef && !isVoidElement">
                            <v-divider class="my-4"></v-divider>
                            <p class="text-overline">Inner Text</p>
                             <v-textarea
                                label="Inner Text"
                                v-model="editableInnerText"
                                @update:model-value="handleInnerTextChange"
                                variant="outlined"
                                density="compact"
                                rows="3"
                                auto-grow
                            ></v-textarea>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
        </v-col>
    </v-row>
</template>

<style scoped>
.rendered-ui {
    height: 80vh;
    overflow: auto;
    position: relative;
    padding: 16px;
}

.element-inspector {
    height: 80vh;
    overflow: auto;
    padding: 0 16px;
}

.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
</style>