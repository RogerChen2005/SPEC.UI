<script setup lang="ts">
import { computed, ref } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import LayerDisplay from "./LayerDisplay.vue";

const specStore = useSpecStore();
const currentTab = computed(() => specStore.currentUploadedPageIndex);
const keyword = ref("");

const pages = computed(() => specStore.uploadedPages);
</script>

<template>
  <v-card variant="tonal" rounded="lg" class="mb-4 mx-auto" elevation="2" :subtitle="pages[currentTab]?.name">
    <template #prepend>
      <v-icon icon="mdi-folder-multiple-outline" class="mx-2"></v-icon>
    </template>
    <template v-slot:title>
      <span class="font-weight-black">Extracted Region</span>
    </template>
  </v-card>

  <v-text-field
    density="compact"
    variant="solo-filled"
    flat
    hide-details
    prepend-inner-icon="mdi-magnify"
    placeholder="Search for..."
    class="my-2 mb-0"
    v-model="keyword"
  ></v-text-field>

  <v-window v-model="currentTab">
    <v-window-item v-for="(page, index) in pages" :key="index" :value="page.id">
      <LayerDisplay :page="page" :checkable="true" :query="keyword"></LayerDisplay>
    </v-window-item>
  </v-window>
</template>

<style>
.v-list-group {
  --list-indent-size: 1px;
}
</style>
