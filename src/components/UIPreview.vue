<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import { createRoot, type Root } from 'react-dom/client';
import React from 'react';

// 动态导入大型库
const loadLibraries = async () => {
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

const containerRef = ref<HTMLElement | null>(null);
const loading = ref(true);
let reactRoot: Root | null = null;
let libraries: Awaited<ReturnType<typeof loadLibraries>> | null = null;

function parseImports(code: string, LIBRARY_MAP: any): { imports: Record<string, any>, cleanCode: string } {
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

const renderReact = async (): Promise<void> => {
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
    if (!loading.value) {
        renderReact();
    }
});

onBeforeUnmount((): void => {
    if (reactRoot) {
        reactRoot.unmount();
    }
    if (containerRef.value) {
        containerRef.value.removeEventListener('click', handleClick);
    }
});
</script>

<template>
    <div class="rendered-ui" ref="containerRef">
        <div v-if="loading" class="loading-container">
            <v-progress-circular indeterminate></v-progress-circular>
            <span class="ml-2">Loading libraries...</span>
        </div>
    </div>
</template>

<style scoped>
.rendered-ui {
    max-height: 700px;
    overflow: auto;
    position: relative;
}

.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
</style>