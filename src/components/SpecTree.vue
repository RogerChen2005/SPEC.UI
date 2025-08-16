<script setup lang="ts">
import { computed, ref } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import LayerDisplay from "./LayerDisplay.vue";
import axios from "~/helpers/RequestHelper";
import CDialog from "./UI/CDialog.vue";
import type { SpecType } from "~/types";

const specStore = useSpecStore();
const currentTab = ref<number>(0);
const keyword = ref("");
const pages = computed(() =>
  specStore.generatedPages.map((page: any, index: number) => ({
    id: index,
    name: page.mark
      ? page.mark
      : page.time
      ? new Date(page.time).toLocaleString()
      : "",
    ...page,
  }))
);
const dialogOpened = ref(false);
const designSpecs = computed(() => specStore.designSpecs);
const designSpecsKeys = computed<SpecType[]>(
  () => Object.keys(designSpecs.value) as SpecType[]
);

const currentPage = computed(() => {
  specStore.currentGeneratedPageIndex = currentTab.value;
  return pages.value[currentTab.value] || null;
});

function selectPage() {
  specStore.selectedSection = undefined;
  specStore.selectedComponent = undefined;
  console.log(specStore.currentGeneratedPageIndex);
}

function generateCode() {
  let index = specStore.currentGeneratedPageIndex;
  axios
    .post("/generate_code", {
      spec: specStore.generatedPages[index].spec,
      save_name: "generate_1",
    })
    .then((response) => {
      if (response.data.success) {
        console.log("generate code success:", response.data);
        specStore.generatedPages[index].code = response.data.data.code;
        specStore.generatedPages[index].complete = true;
        specStore.generatedPages[index].url =
          "data:image/png;base64," + response.data.data.render_image;
        console.log("Updated generated page:", specStore.generatedPages[index]);
      }
    });
}
</script>

<template>
  <v-container fluid class="pa-2">
    <v-sheet class="d-flex align-center ma-0 mt-4">
      <v-icon icon="mdi-folder-multiple-outline" class="mr-2"></v-icon>
      <div class="text-h5 font-weight-bold">My Project</div>
      <v-spacer></v-spacer>
    </v-sheet>

    <v-select
      v-model="currentTab"
      :items="pages"
      item-title="name"
      item-value="id"
      variant="underlined"
      flat
      hide-details
      class="ma-2"
      @click="selectPage"
    >
    </v-select>

    <v-alert
      class="mx-2 mt-3"
      type="info"
      border="start"
      prominent
      variant="tonal"
      density="compact"
      >Right click to edit page structure</v-alert
    >

    <v-text-field
      density="compact"
      variant="solo-filled"
      flat
      hide-details
      prepend-inner-icon="mdi-magnify"
      placeholder="Search for..."
      class="mt-4"
      v-model="keyword"
    ></v-text-field>

    <LayerDisplay
      v-model="currentPage.spec"
      :checkable="false"
      :query="keyword"
      :editable="true"
    >
    </LayerDisplay>

    <v-spacer></v-spacer>

    <v-card
      append-icon="mdi-open-in-new"
      link
      @click="dialogOpened = true"
      title="Global Design Specification"
      subtitle="Open dialog to edit"
      class="ma-2"
      variant="tonal"
    >
    </v-card>

    <div class="pa-2">
      <v-btn
        id="generate-button"
        block
        color="primary"
        @click="generateCode"
        class="mb-2"
        >Generate UI</v-btn
      >
    </div>
  </v-container>
  <Teleport to="body">
    <CDialog v-model:visible="dialogOpened" width="80%" height="80%">
      <template #header>
        <h1 class="text-h4 font-weight-bold ml-4 mt-2">
          Global Design Specification
        </h1>
      </template>
      <v-container fluid class="fill-height pa-4 mt-4 overflow-y-auto">
        <v-row>
          <v-col>
            <h1 class="font-weight-bold text-h5 mb-2">
              UI Design Specification
            </h1>
            <template v-for="key in designSpecsKeys" :key="key">
              <div class="d-flex align-center justify-between mb-2">
                <h2 class="font-weight-bold text-h6">
                  {{ designSpecs[key].label }}
                </h2>
              </div>
              <v-textarea
                v-model="currentPage.spec.UI_Design_Specification[key]"
                variants="tonal"
                rows="3"
                auto-grow
                class="spec-edit"
              ></v-textarea>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </CDialog>
  </Teleport>
</template>

<style>
.v-list-group {
  --list-indent-size: 1px;
}

.component-item {
  cursor: pointer;
}

.component-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>
