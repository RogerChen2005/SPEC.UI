<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick, computed } from 'vue';
import { createRoot, type Root } from 'react-dom/client';
import { useSpecStore } from '~/store/SpecStore';
import type { ComponentType } from 'react';

// Define the shape of our editable attribute objects
interface EditableAttribute {
  name: string;
  value: string;
}


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

function parseImports(code: string, LIBRARY_MAP: any): { imports: Record<string, any>, cleanCode: string } {
    const importRegex = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?/g;
    const imports: Record<string, any> = {};
    let match;

    while ((match = importRegex.exec(code)) !== null) {
        let specifiers = match[1].trim();
        const libName = match[2] as keyof typeof LIBRARY_MAP;
        const libModule = LIBRARY_MAP[libName];

        if (!libModule) {
            console.warn(`Library not found: ${String(libName)}`);
            continue;
        }

        // 检查是否有命名导入
        const namedImportMatch = specifiers.match(/{([^}]+)}/);
        if (namedImportMatch) {
            const namedSpecifiers = namedImportMatch[1].split(',')
                .map(s => s.trim())
                .filter(Boolean);

            namedSpecifiers.forEach(spec => {
                const [orig, alias] = spec.split(' as ').map(s => s.trim());
                imports[alias || orig] = libModule[orig as keyof typeof libModule];
            });

            // 从描述符中移除命名导入部分
            specifiers = specifiers.replace(namedImportMatch[0], '').trim();
        }

        // 剩下的部分应该是默认导入
        if (specifiers.length > 0) {
            // 移除末尾的逗号
            const defaultName = specifiers.replace(/,$/, '').trim();
            if (defaultName) {
                imports[defaultName] = libModule.default || libModule;
            }
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
    const target = (event.target as Element).closest('[data-spec]');
    if (target) {
        event.preventDefault();
        event.stopPropagation();
        const specValue = target.getAttribute('data-spec');
        if (specValue) {
            emit('spec-click', specValue);
        }
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

watch(selectedComponent, (newComp) => {
    if(newComp) {
        const container = containerRef.value;
        if (!container) return;

        container.querySelectorAll('.spec-highlight').forEach(el => {
            el.classList.remove('spec-highlight');
        });
        if (newComp.Data_Component_Id) {
            let componentEl = container.querySelector(`[data-spec="${newComp.Data_Component_Id}"]`);
            if (!componentEl) {
                componentEl = Array.from(container.querySelectorAll('[data-spec]'))
                    .find(el => el.getAttribute('data-spec')?.includes(newComp.Data_Component_Id)) ?? null;
            }
            container.querySelector('.spec-highlight')?.classList.remove('spec-highlight');
            componentEl?.classList.add('spec-highlight');
        }
    }
});

watch(selectedSection, (newSection) => {
    if(newSection) {
        const container = containerRef.value;
        if (!container) return;

        container.querySelectorAll('.spec-highlight').forEach(el => {
            el.classList.remove('spec-highlight');
        });
        if (newSection.Data_Section_Id) {
            let sectionEl = container.querySelector(`[data-spec="${newSection.Data_Section_Id}"]`);
            if(!sectionEl) {
                sectionEl = Array.from(container.querySelectorAll('[data-spec]'))
                    .find(el => el.getAttribute('data-spec')?.includes(newSection.Data_Section_Id)) ?? null;
            }
            sectionEl?.classList.add('spec-highlight');
        }
    }
});

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

        const ReactLib = libraries.React;
        const AntdModule = libraries.LIBRARY_MAP['antd'] as {
            ConfigProvider?: ComponentType<Record<string, unknown>>;
            default?: {
                ConfigProvider?: ComponentType<Record<string, unknown>>;
            };
        } | undefined;
        const ConfigProvider = AntdModule?.ConfigProvider ?? AntdModule?.default?.ConfigProvider ?? null;

        const getPopupContainer = (): HTMLElement => {
            if (containerRef.value) {
                return containerRef.value;
            }
            if (document.body) {
                return document.body;
            }
            return document.documentElement;
        };

        const renderedApp = ReactLib.createElement(elementToRender, {
            popupContainer: getPopupContainer,
            getPopupContainer
        });

        reactRoot = createRoot(containerRef.value);
        reactRoot.render(
            ConfigProvider
                ? ReactLib.createElement(ConfigProvider, { getPopupContainer }, renderedApp)
                : renderedApp
        );

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
        <v-col cols="12" class="pa-4">
            <div class="rendered-ui rounded-lg" ref="containerRef">
                <div v-if="loading" class="loading-container">
                    <v-progress-circular indeterminate></v-progress-circular>
                    <span class="ml-2">Loading libraries...</span>
                </div>
            </div>
        </v-col>
        <v-divider vertical></v-divider>
    </v-row>
</template>

<style scoped>
.rendered-ui {
    max-height: 75vh;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
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

.rendered-ui :deep(.spec-highlight) {
    outline: 2px solid #1E88E5 !important; /* Vuetify primary blue */
    box-shadow: 0 0 8px rgba(30, 136, 229, 0.5) !important;
    background-color: rgba(30, 136, 229, 0.1) !important;
    border-radius: 4px;
}
</style>