<script setup lang="ts">
import { computed, ref } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import LayerDisplay from "./LayerDisplay.vue";
import type { BaseImage } from "~/types";

const props = defineProps({
  currentTab: {
    type: Number,
    required: true,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

const specStore = useSpecStore();
const keyword = ref("");

const pages = computed<BaseImage[]>(() => {
  if(props.editable) {
    return specStore.uploadedPages
  }
  else {
    return specStore.generatedPages
  }
});

const currentPage = computed(() => pages.value[props.currentTab]);
</script>

<template>
  <v-text-field
    density="compact"
    variants="tonal"
    flat
    hide-details
    prepend-inner-icon="mdi-magnify"
    placeholder="Search for..."
    class="mb-4"
    v-model="keyword"
  ></v-text-field>

  <template v-if="currentPage && currentPage.spec">
    <LayerDisplay
      v-model="currentPage.spec"
      :checkable="editable"
      :query="keyword"
      :editable="editable"
    ></LayerDisplay>
  </template>
  <template v-else>
    <div class="text-center">
      <div v-if="!pages[currentTab].complete" class="text-center">Analyzing</div>
      <div v-else class="text-center">No SPEC data</div>
    </div>
  </template>
</template>

<style>
.v-list-group {
  --list-indent-size: 1px;
}
</style>
