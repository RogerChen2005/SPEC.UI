<template>
  <div class="dynamic-renderer-wrapper">
    <!-- Pane for Rendering Dynamic React Code -->
    <div
      ref="renderTarget"
      class="render-pane"
      @click.capture="handleCaptureClick"
    >
      <div v-if="isLoading" class="loading-placeholder">Loading Component...</div>
      <div v-if="error" class="error-placeholder">
          <pre>{{ error }}</pre>
      </div>
    </div>

    <!-- Inspector Pane -->
    <div class="inspector-pane">
      <a-typography-title :level="4">Element Inspector</a-typography-title>
      
      <!-- FIX: Use v-show to avoid DOM patching conflicts -->
      <div v-show="selectedInfo">
        <a-form layout="vertical">
          <a-form-item label="Tag Name">
            <a-input :value="selectedInfo?.tagName" disabled />
          </a-form-item>
          <a-form-item
            v-for="([name, val]) in Object.entries(selectedInfo?.attributes || {})"
            :key="name"
            :label="name"
          >
            <a-input
              :value="val"
              @change="(e: any) => handleAttrChange(name, e.target.value)"
            />
          </a-form-item>
          <a-form-item label="Text Content">
            <a-textarea
              :value="selectedInfo?.text"
              @change="(e: any) => handleTextChange(e.target.value)"
              :rows="4"
            />
          </a-form-item>
        </a-form>
      </div>
      <div v-show="!selectedInfo">
        <a-typography-text type="secondary">
          Click an element in the preview to inspect and edit its properties.
        </a-typography-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
// Import Vue-specific UI components for the inspector pane.
// Your project must have 'ant-design-vue' installed.
import {
  TypographyTitle as ATypographyTitle,
  TypographyText as ATypographyText,
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
  Textarea as ATextarea,
} from 'ant-design-vue';

// --- Type Definitions ---
interface SelectedInfo {
  tagName: string;
  attributes: Record<string, string>;
  text: string;
}

// --- Library Management ---

// We will get these from the `window` object once they are loaded.
let React: any, ReactDOM: any, Babel: any;

// This map will be populated after libraries are confirmed to be loaded.
const LIBRARY_MAP: Record<string, any> = {};

/**
 * Actively waits for the required global libraries to be loaded.
 */
function waitForLibraries(): Promise<void> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if ((window as any).React && (window as any).ReactDOM && (window as any).Babel) {
        clearInterval(interval);

        // Assign libraries now that they exist
        React = (window as any).React;
        ReactDOM = (window as any).ReactDOM;
        Babel = (window as any).Babel;

        // Populate the library map for dynamic imports
        Object.assign(LIBRARY_MAP, {
          antd: (window as any).antd,
          '@ant-design/icons': (window as any).icons,
          recharts: (window as any).recharts,
          react: React,
        });

        resolve();
      }
    }, 100); // Check every 100ms

    // Timeout to prevent infinite loop
    setTimeout(() => {
        clearInterval(interval);
        reject(new Error("Loading core libraries (React, ReactDOM, Babel) timed out. Check the script tags in your index.html."));
    }, 10000); // 10 second timeout
  });
}


/**
 * Parses import statements from a code string.
 */
function parseImports(code: string): { imports: Record<string, any>, cleanCode: string } {
  const importRegex = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?/g;
  const imports: Record<string, any> = {};
  let match;

  while ((match = importRegex.exec(code))) {
    const vars = match[1].trim();
    const lib = match[2];
    const libModule = LIBRARY_MAP[lib];
    if (!libModule) {
      console.warn(`Library not found in global scope for dynamic import: ${lib}`);
      continue;
    }
    let defaultName: string | null = null;
    let namedList: string | null = null;

    if (vars.includes('{')) {
      const [beforeBrace, afterBrace] = vars.split('{', 2);
      const before = beforeBrace.replace(/,$/, '').trim();
      if (before) defaultName = before;
      namedList = '{' + afterBrace;
    } else {
      defaultName = vars;
    }

    if (defaultName) {
      imports[defaultName] = libModule;
    }
    if (namedList) {
      const names = namedList
        .replace(/[{}]/g, '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      names.forEach((name) => {
        const [orig, alias] = name.split(' as ').map((s) => s.trim());
        const key = alias || orig;
        if (libModule[orig]) {
          imports[key] = libModule[orig];
        } else {
          console.warn(`Named import "${orig}" not found in library "${lib}"`);
        }
      });
    }
  }

  const cleanCode = code
    .replace(importRegex, '')
    .replace(/export\s+default\s+/, '')
    .replace(/export\s+{[^}]*}/, '');
  return { imports, cleanCode };
}

// Define component props with TypeScript
const props = defineProps<{
  code: string;
}>();

// --- Vue component state and refs with types ---
const renderTarget = ref<HTMLDivElement | null>(null);
const selectedInfo = ref<SelectedInfo | null>(null);
const selectedElRef = ref<HTMLElement | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
let reactRoot: any = null; // To manage the React 18 root instance

// --- Core Logic: Watch for code changes to re-compile and render ---
onMounted(() => {
  watch(() => props.code, async (newCode: string) => { // Make the watcher async
    if (!renderTarget.value) return;

    isLoading.value = true;
    error.value = null;
    selectedInfo.value = null;
    selectedElRef.value = null;

    try {
      await waitForLibraries();

      if (reactRoot) {
        reactRoot.unmount();
        reactRoot = null;
      } else if (renderTarget.value && renderTarget.value.innerHTML) {
        ReactDOM.unmountComponentAtNode(renderTarget.value);
      }
      
      if (renderTarget.value) {
        renderTarget.value.innerHTML = '';
      }

      const { imports, cleanCode } = parseImports(newCode);
      const compiled = Babel.transform(cleanCode, {
        presets: ['react', 'env'],
      }).code;

      const scope = { React, ...imports };
      const func = new Function(...Object.keys(scope), `${compiled}; return App;`);
      const ComponentToRender = func(...Object.values(scope));

      if (typeof ComponentToRender !== 'function') {
        throw new Error("The provided code did not resolve to a renderable React component named 'App'.");
      }

      const reactElement = React.createElement(ComponentToRender);
      if (ReactDOM.createRoot) {
        reactRoot = ReactDOM.createRoot(renderTarget.value);
        reactRoot.render(reactElement);
      } else {
        ReactDOM.render(reactElement, renderTarget.value);
      }

    } catch (err: any) {
      console.error('Failed to render dynamic component:', err);
      error.value = err.stack || err.message;
    } finally {
      isLoading.value = false;
    }
  }, { immediate: true });
});


// --- Inspector Panel Methods ---

const handleCaptureClick = (e: MouseEvent) => {
  e.stopPropagation();
  const el = e.target as HTMLElement;

  if (el === renderTarget.value) {
    return;
  }

  selectedElRef.value = el;
  const attrs = Array.from(el.attributes).reduce((acc, attr) => {
    acc[attr.name] = attr.value;
    return acc;
  }, {} as Record<string, string>);

  selectedInfo.value = {
    tagName: el.tagName.toLowerCase(),
    attributes: attrs,
    text: el.innerText,
  };
};

const handleAttrChange = (name: string, value: string) => {
  const el = selectedElRef.value;
  if (!el || !selectedInfo.value) return;
  
  // Directly manipulate the DOM
  el.setAttribute(name, value);
  
  // Create a new object for the reactive state to prevent conflicts.
  selectedInfo.value = {
    ...selectedInfo.value,
    attributes: {
      ...selectedInfo.value.attributes,
      [name]: value,
    },
  };
};

const handleTextChange = (value: string) => {
  const el = selectedElRef.value;
  if (!el || !selectedInfo.value) return;

  // Directly manipulate the DOM
  el.innerText = value;

  // Create a new object for the reactive state.
  selectedInfo.value = {
    ...selectedInfo.value,
    text: value,
  };
};
</script>

<style scoped>
.dynamic-renderer-wrapper {
  display: flex;
  width: 100%;
  height: 100vh; /* Full viewport height */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
}

.render-pane {
  flex: 1;
  overflow: auto;
  background-color: #ffffff;
  padding: 1rem;
  position: relative;
}

.inspector-pane {
  width: 320px;
  flex-shrink: 0;
  border-left: 1px solid #e8e8e8;
  padding: 16px;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.loading-placeholder,
.error-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;
    font-size: 1.2em;
}

.error-placeholder pre {
    color: #d32f2f;
    background-color: #ffebee;
    padding: 1em;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    max-width: 100%;
}
</style>
