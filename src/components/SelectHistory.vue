<template>
  <v-select
    v-if="currentPage && currentPage.history"
    v-model="currentTab"
    :items="histories"
    item-title="name"
    item-value="index"
    label="History Versions"
  >
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        @click="changeVersion(item.raw.index)"
      ></v-list-item>
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { useSpecStore } from "~/store/SpecStore";
import { computed, ref } from "vue";
const specStore = useSpecStore();
const currentTab = ref<number>(0);
const currentPage = computed(
  () => specStore.generatedPages[specStore.currentGeneratedPageIndex]
);
const histories = computed(
  () =>
    currentPage.value?.history?.map((page: any, index: number) => ({
      index: index,
      name: page.mark
        ? page.mark
        : page.time
        ? new Date(page.time).toLocaleString()
        : "",
      ...page,
    })) ?? []
);

function changeVersion(index: number) {

  if (currentPage.value && currentPage.value.history) {
    const selectedHistory = currentPage.value.history[index];
    console.log("Selected history version:", selectedHistory);
    if (selectedHistory) {
      specStore.selectedSection = undefined;
      specStore.selectedComponent = undefined;
      const { history, ...rest } = currentPage.value;
      currentPage.value.history.push(rest);
      Object.assign(currentPage.value, {
        ...selectedHistory,
        history: currentPage.value.history,
      });
      currentPage.value.history.splice(index, 1);
      currentTab.value = index;
      console.log("Changed to history version:", selectedHistory);
    }
  }
}
</script>