<script setup lang="ts">
import { ref, type ComponentPublicInstance } from "vue";
import type { Component, EditInfo, Section, SPEC } from "~/types";
import EditComponent from "./EditComponent.vue";
import EditSection from "./EditSection.vue";
import { useSpecStore } from "~/store/SpecStore";

const specStore = useSpecStore();

const props = defineProps({
  checkable: {
    type: Boolean,
    default: false,
  },
  query: {
    type: String,
    default: "",
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const spec = defineModel<SPEC>();
// const emit = defineEmits<{
//   (e: "section-edit", editInfo: EditInfo, section: Section): void;
//   (e: "component-edit", editInfo: EditInfo, component: Component): void;
// }>();

const sectionsRef = ref<Record<string, InstanceType<typeof Element>>>({});
const componentsRef = ref<Record<string, InstanceType<typeof Element>[]>>({});
const menuOpen = ref(false);
const attachedElement = ref<Element>();
const editingSection = ref<Section | null>(null);
const editingComponent = ref<Component | null>(null);
const editInfo = ref<EditInfo>({
  sectionIndex: -1,
  componentIndex: -1,
});

function addSectionRef(
  el: ComponentPublicInstance | Element | null,
  index: string
) {
  if (el) {
    sectionsRef.value[index] = (el as ComponentPublicInstance).$el as Element;
  }
}

function addComponentRef(
  el: ComponentPublicInstance | Element | null,
  sectionName: string,
  index: number
) {
  if (el) {
    if (!componentsRef.value[sectionName]) {
      componentsRef.value[sectionName] = [];
    }
    componentsRef.value[sectionName][index] = (el as ComponentPublicInstance)
      .$el as Element;
  }
}

function getComponentIcon(componentType: Component["Component_Type"]) {
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

function sectionFilter(section: Section, query: string) {
  if (!props.checkable) {
    return !query || section.Section_Name.includes(query);
  } else {
    return section.selected;
  }
}

function componentFilter(component: Component) {
  return props.checkable ? true : component.selected;
}


function onSectionLClick(section: Section) {
  specStore.selectedComponent = undefined;
  specStore.selectedSection = section;
  console.log("Selected section:", section);
}

function onComponentLClick(component: Component) {
  specStore.selectedSection = undefined;
  specStore.selectedComponent = component;
  console.log("Selected component:", component);
}

function onSectionRClick(section: Section, sectionIndex: number) {
  if (props.editable) {
    editingComponent.value = null;
    editingSection.value = section;
    menuOpen.value = true;
    editInfo.value.sectionIndex = sectionIndex;
    attachedElement.value = sectionsRef.value[section.Section_Name];
  }
}

function onComponentRClick(
  sectionIndex: number,
  section: Section,
  componentIndex: number,
  component: Component
) {
  if (props.editable) {
    editingSection.value = null;
    editingComponent.value = component;
    editInfo.value.sectionIndex = sectionIndex;
    editInfo.value.componentIndex = componentIndex;
    attachedElement.value =
      componentsRef.value[section.Section_Name][componentIndex];
    menuOpen.value = true;
  }
}

function onSectionEdit(section: Section) {
  // if (editInfo.value.sectionIndex !== -1) {
  //   emit("section-edit", editInfo.value, section);
  //   editingSection.value = null;
  // }
  if (spec.value) {
    spec.value.Page_Composition.Sections[
      editInfo.value.sectionIndex
    ] = section;
  }
  menuOpen.value = false;
}

function onComponentEdit(component: Component) {
  // if (editInfo.value.sectionIndex !== -1 && editInfo.value.componentIndex !== -1) {
  //   emit("component-edit", editInfo.value, component);
  //   editingComponent.value = null;
  // }
  // menuOpen.value = false;
  if (spec.value) {
    spec.value.Page_Composition.Sections[
      editInfo.value.sectionIndex
    ].Contained_Components[editInfo.value.componentIndex] = component;
  }
  menuOpen.value = false;
}
</script>

<template>
  <v-list density="compact" class="rounded-lg">
    <template v-if="spec">
      <template
        v-for="(section, sectionIndex) in spec.Page_Composition.Sections"
        :key="section.Section_Name"
      >
        <v-list-group
          v-if="sectionFilter(section, query)"
          :value="section.Section_Name"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :ref="(el) => addSectionRef(el, section.Section_Name)"
              @click="onSectionLClick(section)"
              @contextmenu.prevent="onSectionRClick(section, sectionIndex)"
              class="selectable-item"
            >
              <template v-if="checkable" v-slot:prepend>
                <v-checkbox-btn
                  v-model="section.selected"
                  @click.stop
                ></v-checkbox-btn>
              </template>
              <template #title>
                <v-icon>mdi-texture-box</v-icon>
                {{ section.Section_Name }}
              </template>
            </v-list-item>
          </template>

          <template
            v-for="(component, componentIndex) in section.Contained_Components"
            :key="componentIndex"
            :value="component.ComponentID"
          >
            <v-list-item
              v-ripple
              v-if="componentFilter(component)"
              :ref="
                (el) =>
                  addComponentRef(el, section.Section_Name, componentIndex)
              "
              @click="onComponentLClick(component)"
              @contextmenu.prevent="
                onComponentRClick(
                  sectionIndex,
                  section,
                  componentIndex,
                  component
                )
              "
              class="selectable-item"
            >
              <template #title>
                <v-icon>{{
                  getComponentIcon(component.Component_Type)
                }}</v-icon>
                {{ component.Function }}
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
  </v-list>
  <v-menu
    :target="attachedElement"
    v-model="menuOpen"
    location="end"
    :close-on-content-click="false"
    z-index="9999"
  >
    <EditComponent
      :edit-component="editingComponent"
      @edit="onComponentEdit"
    ></EditComponent>
    <EditSection
      :edit-section="editingSection"
      @edit="onSectionEdit"
    ></EditSection>
  </v-menu>
</template>

<style scoped>
.selectable-item {
  cursor: pointer;
}

.selectable-item:hover {
  background-color: rgba(var(--v-theme-secondary), 0.08);
}
</style>
