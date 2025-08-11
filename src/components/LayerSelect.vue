<script setup lang="ts">
import { computed, ref } from "vue";
import { useSpecStore } from "~/store/specStore";
import LayerDisplay from "./LayerDisplay.vue";

defineProps({
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

const pages = computed(() => specStore.uploadedPages);
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

  <LayerDisplay
    :page="pages[currentTab]"
    :checkable="editable"
    :query="keyword"
  ></LayerDisplay>
</template>

<style>
.v-list-group {
  --list-indent-size: 1px;
}
</style>
