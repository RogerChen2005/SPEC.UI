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
    @click="selectPage"
  ></v-select>

  <div v-if="currentPage">
    <v-list density="compact" nav>
      <template v-if="currentPage.spec">
        <template
          v-for="section in currentPage.spec.Page_Composition.Sections"
          :key="section.Section_Name"
        >
          <v-list-group
            v-if="!keyword || section.Section_Name.includes(keyword)"
            :value="section.Section_Name"
          >
            <template v-slot:activator="{ props }">
              <v-list-item 
                v-bind="props"
                @click="selectSection(section)"
                class="section-item"
              >
                <template #title>
                  <v-icon>mdi-texture-box</v-icon>
                  {{ section.Section_Name }}
                </template>
              </v-list-item>
            </template>

            <template v-for="component in section.Contained_Components" :key="component.Function">
              <v-menu
                location="end"
                :close-on-content-click="false"
                offset="10"
              >
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :value="component.Function"
                    @click="selectComponent(component)"
                    class="component-item"
                  >
                    <template #title>
                      <v-icon>{{ getComponentIcon(component.Component_Type) }}</v-icon>
                      {{ component.Function }}
                    </template>
                  </v-list-item>
                </template>

                <v-card width="350" elevation="5">
                  <v-card-title class="d-flex align-center text-body-2">
                    Attributes - <strong>{{ component.Component_Type }}</strong>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" size="small"></v-btn>
                  </v-card-title>
                  <v-divider></v-divider>

                  <v-card-text>
                    <v-textarea
                      :model-value="getComponentInput('Function')"
                      @update:model-value="updateComponentInput('Function', $event)"
                      label="Function"
                      :placeholder="component.Function"
                      rows="3"
                      auto-grow
                      class="mb-2"
                    ></v-textarea>
                    
                    <!-- 使用自定义颜色输入组件 -->
                    <ColorTextField
                      :model-value="getComponentInput('Color_Scheme')"
                      @update:model-value="updateComponentInput('Color_Scheme', $event)"
                      label="Color"
                      :placeholder="component.Color_Scheme"
                      rows="3"
                      auto-grow
                      class="mb-2"
                    />
                    
                    <v-textarea
                      :model-value="getComponentInput('Component_Layout_Style')"
                      @update:model-value="updateComponentInput('Component_Layout_Style', $event)"
                      label="Layout"
                      :placeholder="component.Component_Layout_Style"
                      rows="3"
                      auto-grow
                      class="mb-2"
                    ></v-textarea>
                  </v-card-text>

                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="flat" @click="edit(component)">Edit</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </template>
          </v-list-group>
        </template>
      </template>
    </v-list>
  </div>

  <v-spacer></v-spacer>

  <div class="pa-2">
    <v-btn block color="primary" @click="generateCode" class="mb-2">Generate UI</v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import type { Component, Section } from "~/types";
import axios from '~/helpers/RequestHelper'
import ColorTextField from './ColorTextField.vue'
import { spec } from "node:test/reporters";

const specStore = useSpecStore();
const currentTab = ref<number>(0);
const keyword = ref("");
const componentInputs = ref<Partial<Record<keyof Component, string>>>({});
const pages = computed(() => 
  specStore.generatedPages.map((page: any, index: number) => ({
    id: index,
    name: page.mark ? page.mark : page.time ? new Date(page.time).toLocaleString() : "",
    ...page
  }))
);

const currentPage = computed(() => {
  specStore.currentGeneratedPageIndex = currentTab.value;
  return pages.value[currentTab.value] || null;
});

function selectComponent(component: Component) {
  // 更新 specStore 中的 selectedComponent
  specStore.selectedComponent = component;
  specStore.selectedSection = null;
  updateComponentInput('Function', component.Function);
  updateComponentInput('Color_Scheme', component.Color_Scheme);
  updateComponentInput('Component_Layout_Style', component.Component_Layout_Style);
  console.log('Selected component:', component);
}

function selectSection(section: Section) {
  // 更新 specStore 中的 selectedSection
  specStore.selectedSection = section;
  specStore.selectedComponent = null;
  console.log('Selected section:', section);
}

function selectPage() {
  specStore.selectedSection = null;
  specStore.selectedComponent = null;
}


function edit(component: Component) {
  // 这里可以添加编辑组件的逻辑
  component.Color_Scheme = getComponentInput('Color_Scheme');
  component.Component_Layout_Style = getComponentInput('Component_Layout_Style');
  component.Function = getComponentInput('Function');
  console.log('Edit component:', component);
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

function getComponentInput(field: string) {
  if (!componentInputs.value) {
    componentInputs.value = {};
  }
  return componentInputs.value[field as keyof Component] || '';
}

function updateComponentInput(field: string, value: string) {
  if (!componentInputs.value) {
    componentInputs.value = {};
  }
  componentInputs.value[field as keyof Component] = value;
}

function generateCode() {
  let index = specStore.currentGeneratedPageIndex;
  axios.post("/generate_code", {
    spec: specStore.generatedPages[index].spec,
    save_name: "generate_1"
  }).then((response) => {
    if(response.data.success) {
      console.log("generate code success:", response.data);
      specStore.generatedPages[index].code =  response.data.data.code;
      specStore.generatedPages[index].render_image = response.data.data.render_image;
      specStore.generatedPages[index].complete = true;
      specStore.generatedPages[index].url = "data:image/png;base64," + response.data.data.render_image;
      console.log("Updated generated page:", specStore.generatedPages[index]);
    }
  })
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

.section-item {
  cursor: pointer;
}

.section-item:hover {
  background-color: rgba(var(--v-theme-secondary), 0.08);
}
</style>