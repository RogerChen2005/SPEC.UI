<template>
    <div ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import { createRoot, type Root } from 'react-dom/client';

interface Props {
    code: string;
}

interface Emits {
    (e: 'spec-click', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>()

const containerRef = ref<HTMLElement | null>(null);
let reactRoot: Root | null = null;

const handleClick = (event: Event): void => {
    // Find the closest element with data-spec, in case of nested elements.
    const target = (event.target as Element).closest('[data-spec]');
    if (target) {
        // Prevent default browser action and stop event propagation
        event.preventDefault();
        event.stopPropagation();
        const specValue = target.getAttribute('data-spec');
        if (specValue) {
            emit('spec-click', specValue);
        }
    }
};

const renderReact = async (): Promise<void> => {
    if (!containerRef.value || !props.code) return;

    // Clean up previous render and listeners
    if (reactRoot) {
        reactRoot.unmount();
        reactRoot = null;
    }
    // Remove any existing listeners to be safe
    containerRef.value.removeEventListener('click', handleClick);

    try {

        // Create a function to safely evaluate the transpiled code
        // We pass React into its scope to be used
        // const getReactElement = new Function('React', `return ${transformResult.code}`) as (react: typeof React) => React.ReactElement;
        // const elementToRender = getReactElement(React);

        // Create a new React root and render the element
        reactRoot = createRoot(containerRef.value);
        reactRoot.render(props.code);

        // Wait for the DOM to be updated
        await nextTick();

        // Add a single event listener to the container using event delegation
        // This is more efficient than adding a listener to each element
        containerRef.value.addEventListener('click', handleClick);

    } catch (error) {
        console.error("Failed to render React component:", error);
        if (containerRef.value) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            containerRef.value.innerHTML = `<pre style="color: red;">Error: ${errorMessage}</pre>`;
        }
    }
};

onMounted((): void => {
    renderReact();
});

watch(() => props.code, (): void => {
    renderReact();
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

<style scoped>
div {
    width: 100%;
    height: 100%;
}
</style>