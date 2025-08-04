<template>
  <v-sheet class="d-flex align-center pa-2">
    <v-icon icon="mdi-folder-multiple-outline" class="mr-2"></v-icon>
    <v-list-item-title class="font-weight-bold">My Project</v-list-item-title>
    <v-spacer></v-spacer>
    <v-icon icon="mdi-chevron-down"></v-icon>
  </v-sheet>

  <v-text-field
    density="compact"
    variant="solo-filled"
    flat
    hide-details
    prepend-inner-icon="mdi-magnify"
    placeholder="Search for..."
    class="my-2"
    v-model="keyword"
  ></v-text-field>

  <v-select
    v-model="currentTab"
    :items="pages"
    item-title="name"
    item-value="id"
    variant="underlined"
    flat
    hide-details
    class="ma-2"
  ></v-select>

  <!-- 使用 currentPage 而不是 pages[currentTab] -->
  <div v-if="currentPage">
    <v-list density="compact" nav>
      <template v-if="currentPage.spec">
        <template
          v-for="region in currentPage.spec.PageStructure.SectionDivision"
          :key="region.SectionID"
        >
          <v-list-group
            v-if="!keyword || region.SectionName.includes(keyword)"
            :value="region.SectionID"
          >
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <v-icon>mdi-texture-box</v-icon>
                  {{ region.SectionName }}
                </template>
              </v-list-item>
            </template>

            <v-list-item
              v-for="component in region.ContainedComponents"
              :key="component.ComponentID"
              :value="component.ComponentID"
              :active="specStore.selectedComponent?.ComponentID === component.ComponentID"
              @click="selectComponent(component)"
              class="component-item"
            >
              <template #title>
                <v-icon>{{
                  getComponentIcon(component.ComponentType)
                }}</v-icon>
                {{ component.InformationCarried }}
              </template>
            </v-list-item>
          </v-list-group>
        </template>
      </template>
    </v-list>
  </div>

  <v-spacer></v-spacer>

  <div class="pa-2">
    <v-btn block color="primary" @click="generateCode" class="mb-2">Use Spec to generate code</v-btn>
    <v-btn block variant="outlined" @click="preview">Generate Preview</v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import type { Component, SPEC } from "~/types";
import axios from '~/helpers/RequestHelper'

const specStore = useSpecStore();
const currentTab = ref<number>(0);
const keyword = ref("");

const pages = computed(() => 
  specStore.generatedPages.map((page, index) => ({
    id: index,
    name: `Page ${index + 1}`,
    ...page
  }))
);

const currentPage = computed(() => {
  return pages.value[currentTab.value] || null;
});

function selectComponent(component: Component) {
  // 更新 specStore 中的 selectedComponent
  specStore.selectedComponent = component;
  console.log('Selected component:', component);
}

function getComponentIcon(componentType: Component["ComponentType"]) {
  switch (componentType) {
    case "Image":
      return "mdi-image-outline";
    case "Text":
      return "mdi-format-text";
    case "Menu":
      return "mdi-menu";
    case "Card":
      return "mdi-card-outline";
    case "Button":
      return "mdi-gesture-tap-button";
    case "Tabs":
      return "mdi-tab";
    case "Input":
      return "mdi-form-textbox";
    case "Form":
      return "mdi-form-select";
    case "Divider":
      return "mdi-minus";
    default:
      return "mdi-help-box-outline";
  }
}

function generateCode() {
  axios.post("/generate_code", {
    spec: specStore.generatedPages[specStore.currentGeneratedPageIndex],
    save_name: "generate_1"
  }).then((response) => {
    if(response.data.success) {
      specStore.generatedPages[specStore.currentGeneratedPageIndex].code =  response.data.code;
      specStore.generatedPages[specStore.currentGeneratedPageIndex].render_image = response.data.render_image;
    }
  })
}

function preview() {

}
</script>

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