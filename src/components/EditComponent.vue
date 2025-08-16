<script setup lang="ts">
import ColorTextField from "./ColorTextField.vue";
import { type PropType, ref, watch } from "vue";
import type { Component } from "~/types";
import axios from "~/helpers/RequestHelper";

const props = defineProps({
  editComponent: {
    type: Object as PropType<Component | null>,
  },
});

const component = ref<Component>({
  Component_Type: "",
  Function: "",
  Color_Scheme: {},
  Component_Layout_Style: "",
  Data_Component_Id: "",
});

watch(
  () => props.editComponent,
  () => {
    component.value = {
      Component_Type: "",
      Function: "",
      Color_Scheme: {},
      Component_Layout_Style: "",
      Data_Component_Id: "",
    };
  },
  { immediate: true }
);

const emit = defineEmits<{
  (e: "edit", component: Component): void;
}>();

const editKeys: (keyof Component)[] = [
  "Function",
  "Color_Scheme",
  "Component_Layout_Style",
];

function edit(component: Component) {
  console.log("Edit component:", component);
  let text = "User wants to edit ";

  for (let key of editKeys) {
    if ((component[key] as string).trim() != "") {
      text += `${key}: with suggestion: ${component[key]}, `;
    }
  }

  text += "if necessary, you can edit other attributes to better follow the suggestion."

  let payload = {
    spec: props.editComponent,
    text: text,
  };
  console.log(payload);
  axios.post("/edit_spec", payload).then((response) => {
    if (response.data.success) {
      console.log("edit spec success:", response.data);
      emit("edit", response.data.data.spec);
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

      <v-card-text style="max-height: 80vh; overflow: auto;">
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

        <ColorTextField
          v-model="editComponent.Color_Scheme"
          class="mb-4"
        />

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
