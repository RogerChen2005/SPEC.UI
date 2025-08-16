<script setup lang="ts">
import { useMessageStore } from "~/store/messageStore";
import type { Color_Scheme } from "~/types";

const modelValue = defineModel<Color_Scheme>();
const messageStore = useMessageStore();

function copyToClipboard(color: string) {
  navigator.clipboard.writeText(color);
  messageStore.add(`Copied color ${color} to clipboard`, "success");
}
</script>

<template>
  <div v-if="modelValue && Object.keys(modelValue).length > 0">
    <h4 class="mb-2">Color Scheme</h4>
    <v-list density="compact" class="rounded-lg my-2 pa-0" variant="tonal">
      <v-list-item
        v-for="(color, componentName) in modelValue"
        :key="componentName"
        class="px-2"
      >
        <template #prepend>
          <div
            class="color-preview mr-4"
            v-tooltip="`${color}`"
            :style="{ backgroundColor: color }"
            @click="copyToClipboard(color)"
          ></div>
        </template>
        
        <v-list-item-title>{{ componentName }}</v-list-item-title>
        <v-list-item-subtitle>{{ color }}</v-list-item-subtitle>
        
        <template #append>
          <v-btn
            icon="mdi-content-copy"
            variant="text"
            size="small"
            @click="copyToClipboard(color)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </div>
  <div v-else class="text-center py-4 text-grey">
    No colors defined
  </div>
</template>

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
