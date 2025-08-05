<script setup lang="ts">
import type { PropType } from "vue";
import type { Component, Region, UploadImage } from "~/types";

const props = defineProps({
  checkable: {
    type: Boolean,
    default: false,
  },
  query: {
    type: String,
    default: "",
  },
  page: {
    type: Object as PropType<UploadImage>,
    required: true,
  },
});

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

function regionFilter(region: Region, query: string) {
  if (props.checkable) {
    return !query || region.SectionName.includes(query);
  } else {
    return region.selected;
  }
}

function componentFilter(component: Component) {
  return props.checkable ? true: component.selected;
}
</script>

<template>
  <v-list density="compact" nav>
    <template v-if="page.spec">
      <template
        v-for="region in page.spec.PageStructure.SectionDivision"
        :key="region.SectionID"
      >
        <v-list-group
          v-if="regionFilter(region, query)"
          :value="region.SectionID"
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-if="checkable" v-slot:prepend>
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

          <template
            v-for="component in region.ContainedComponents"
            :key="component.ComponentID"
            :value="component.ComponentID"
          >
            <v-list-item v-if="componentFilter(component)">
              <template #title>
                <v-icon>{{ getComponentIcon(component.ComponentType) }}</v-icon>
                {{ component.InformationCarried }}
              </template>
              <template v-if="checkable" v-slot:prepend>
                <v-checkbox-btn
                  v-model="component.selected"
                  @click.stop
                ></v-checkbox-btn>
              </template>
            </v-list-item>
          </template>
        </v-list-group>
      </template>
    </template>
    <v-list-item v-else>
      <v-list-item-subtitle v-if="!page.analysisComplete" class="text-center"
        >Analyzing</v-list-item-subtitle
      >
      <v-list-item-subtitle v-else class="text-center"
        >No SPEC data</v-list-item-subtitle
      >
    </v-list-item>
  </v-list>
</template>
