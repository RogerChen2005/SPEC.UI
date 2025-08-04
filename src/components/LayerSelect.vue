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

  <v-window v-model="currentTab">
    <v-window-item v-for="(page, index) in pages" :key="index" :value="page.id">
      <v-list density="compact" nav>
        <template v-if="page.spec">
          <template
            v-for="region in page.spec.PageStructure.SectionDivision"
            :key="region.SectionID"
          >
            <v-list-group
              v-if="!keyword || region.SectionName.includes(keyword)"
              :value="region.SectionID"
            >
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-checkbox-btn
                      v-model="region.selected"
                      @click.stop
                    ></v-checkbox-btn>
                  </template>
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
              >
                <template #title>
                  <v-icon>{{
                    getComponentIcon(component.ComponentType)
                  }}</v-icon>
                  {{ component.InformationCarried }}
                </template>
                <template v-slot:prepend>
                  <v-checkbox-btn
                    v-model="component.selected"
                    @click.stop
                  ></v-checkbox-btn>
                </template>
              </v-list-item>
            </v-list-group>
          </template>
        </template>
        <v-list-item v-else>
          <v-list-item-subtitle
            v-if="!page.analysisComplete"
            class="text-center"
            >Analyzing</v-list-item-subtitle
          >
          <v-list-item-subtitle v-else class="text-center"
            >No SPEC data</v-list-item-subtitle
          >
        </v-list-item>
      </v-list>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import type { Component } from "~/types";
const specStore = useSpecStore();

const currentTab = ref<string>("0");
const keyword = ref("");

const pages = computed(() => specStore.uploadedPages);

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
</script>

<style>
.v-list-group {
  --list-indent-size: 1px;
}
</style>
