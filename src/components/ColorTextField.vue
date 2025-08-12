<template>
  <v-textarea
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="$attrs"
  >
    <template #prepend-inner>
      <div 
        v-if="colors.length > 0"
        class="d-flex flex-wrap align-start mr-2 mt-1"
        style="max-width: 100px;"
      >
        <v-tooltip
          v-for="(color, index) in colors"
          :key="index"
          :text="color"
          location="top"
        >
          <template #activator="{ props }">
            <div
              v-bind="props"
              class="color-preview"
              :style="{ backgroundColor: color }"
              @click="copyToClipboard(color)"
            ></div>
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-textarea>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: string];
}>();

const colors = computed(() => {
  if (!props.modelValue) return [];
  
  const colorRegex = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)/gi;
  
  const matches = props.modelValue.match(colorRegex) || [];
  return matches.filter(color => isValidColor(color)).slice(0, 8); // 增加到8个颜色，因为有更多空间
});

function isValidColor(color: string): boolean {
  const style = new Option().style;
  style.color = color;
  return style.color !== '';
}

function copyToClipboard(color: string) {
  navigator.clipboard.writeText(color);
}
</script>

<style scoped>
.color-preview {
  width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin: 1px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-preview:hover {
  transform: scale(1.2);
}
</style>