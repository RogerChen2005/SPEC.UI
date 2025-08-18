<script setup lang="ts">
import ColorTextField from "./ColorTextField.vue";
import { type PropType, ref, watch, computed } from "vue";
import type { Component } from "~/types";
import axios from "~/helpers/RequestHelper";
import { useSpecStore } from "~/store/SpecStore";

interface ComponentSuggestion {
  Function: string;
  Color_Scheme: string;
  Component_Layout_Style: string;
}

const specStore = useSpecStore();

const currentPage = computed(() => {
  return specStore.generatedPages[specStore.currentGeneratedPageIndex];
});

const props = defineProps({
  editComponent: {
    type: Object as PropType<Component | null>,
  },
});

const component = ref<ComponentSuggestion>({
  Function: "",
  Color_Scheme: "",
  Component_Layout_Style: "",
});

watch(
  () => props.editComponent,
  () => {
    component.value = {
      Function: "",
      Color_Scheme: "",
      Component_Layout_Style: "",
    };
  },
  { immediate: true }
);

const editKeys: (keyof ComponentSuggestion)[] = [
  "Function",
  "Color_Scheme",
  "Component_Layout_Style",
];

function edit(component: ComponentSuggestion) {
  console.log("Edit component:", component);
  let text = `用户想要更改path为Page_Composition/Sections/Components中Data_Component_Id为${specStore.selectedComponent?.Data_Component_Id}的组件，`;

  for (let key of editKeys) {
    if ((component[key] as string).trim() != "") {
      text += `${key}的更改意图为: ${component[key]}, `;
    }
  }

  let payload = {
    spec: currentPage.value.spec,
    text: text,
  };
  console.log(payload);
  axios.post("/edit_spec", payload).then((response) => {
    if (response.data.success) {
      console.log("edit spec success:", response.data);
      currentPage.value.spec = response.data.data.spec;
      currentPage.value.code = response.data.data.extracted_code;
    }
  });
}
</script>

<template>
  <v-container v-if="editComponent">
    <v-card width="350" elevation="5">
      <v-card-title class="d-flex align-center text-body-2">
        Attributes - &nbsp
        <strong>{{ editComponent.Component_Type }}</strong>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text style="max-height: 80vh; overflow: auto">
        <h1 class="text-h6 font-weight-bold mb-2">Function</h1>
        <v-textarea
          v-model="editComponent.Function"
          density="compact"
          rows="1"
          auto-grow
          readonly
          variant="solo-filled"
        ></v-textarea>

        <v-text-field
          v-model="component.Function"
          density="compact"
          label="Function Suggestion"
          placeholder="Describe the function of the component"
          variant="outlined"
        ></v-text-field>

        <h1 class="text-h6 font-weight-bold mb-2">Color Scheme</h1>

        <ColorTextField v-model="editComponent.Color_Scheme" class="mb-4" />

        <v-text-field
          v-model="component.Color_Scheme"
          density="compact"
          label="Color Suggestion"
          placeholder="Describe the function of the component"
          variant="outlined"
        ></v-text-field>

        <h1 class="text-h6 font-weight-bold mb-2">Layout Style</h1>

        <v-textarea
          v-model="editComponent.Component_Layout_Style"
          rows="1"
          auto-grow
          variant="solo-filled"
          readonly
        ></v-textarea>

        <v-text-field
          v-model="component.Color_Scheme"
          density="compact"
          label="Layout Suggestion"
          placeholder="Describe the function of the component"
          variant="outlined"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="edit(component)"
          >Edit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>
