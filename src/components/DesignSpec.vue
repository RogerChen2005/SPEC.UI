<script lang="ts" setup>
import { computed, ref } from "vue";
import { checkMissingSpecs } from "~/helpers/ReferenceHelper";
import { useSpecStore } from "~/store/SpecStore";

const specStore = useSpecStore();
const designSpecs = computed(() => specStore.designSpecs);
const DraggingInfo = computed(() => specStore.DraggingInfo);
const warningVisible = ref(false);
const missingLabels = ref<string[]>([]);

function onDrop(index: number) {
  designSpecs.value[index].value = DraggingInfo.value.selectedPageIndex;
}

function generate() {
  missingLabels.value = checkMissingSpecs(designSpecs.value);
  if (missingLabels.value.length > 0) {
    warningVisible.value = true;
  } else {
    specStore.generateImage();
  }
}
</script>

<template>
  <v-card class="pa-4" height="100%">
    <v-card-title class="font-weight-bold">设计规范</v-card-title>
    <v-card-subtitle class="text-body-2 mb-4"
      >Drag and drop the uploaded pages</v-card-subtitle
    >
    <v-list variant="text" class="px-2 rounded" style="background: transparent">
      <v-list-item
        v-for="(item, index) in designSpecs"
        :key="item.label"
        class="mb-4 border rounded"
        @dragover.prevent
        @drop="onDrop(index)"
        :class="{
          dropable: DraggingInfo.isDragging,
        }"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" class="mr-3"></v-icon>
        </template>
        <v-list-item-title>{{ item.label }}</v-list-item-title>
        <template v-slot:append>
          <v-chip size="small" v-if="item.value >= 0" variant="tonal"
            >Image {{ item.value + 1 }}</v-chip
          >
        </template>
      </v-list-item>
    </v-list>
    <v-card variant="tonal" rounded="lg" class="pa-6" max-width="400">
      <h2 class="text-h5 font-weight-bold">Type your prompt:</h2>

      <v-text-field
        v-model="specStore.promptText"
        variant="underlined"
        placeholder="Tell me what you think.."
        rows="3"
        no-resize
        auto-grow
      ></v-text-field>

      <p class="text-body-2 text-medium-emphasis mt-2 mb-4">
        Use short, relevant keywords. Separate terms with commas if needed.
      </p>

      <v-divider></v-divider>

      <v-btn
        variant="text"
        color="primary"
        class="text-none mt-4 pa-0"
        disabled
      >
        Need ideas? Check the tips.
      </v-btn>
    </v-card>

    <v-btn
      block
      color="primary"
      size="large"
      class="text-none mx-2 mt-8"
      @click="generate"
    >
      Generate
    </v-btn>
  </v-card>

  <v-dialog v-model="warningVisible" width="35%">
    <template v-slot:default="{ isActive }">
      <v-card title="Missing Design Specs" class="pa-2">
        <v-card-text>
          Please select an image for the following design specs:
          <ul class="pa-2 pl-8" style="color: rgb(var(--v-theme-error));">
            <li v-for="label in missingLabels" :key="label">{{ label }}</li>
          </ul>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
.dropable {
  background: rgba(var(--v-theme-on-surface), 0.1);
  border: 1px dashed rgb(var(--v-theme-on-surface)) !important;
}
</style>
