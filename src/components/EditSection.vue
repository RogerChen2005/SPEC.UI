<script setup lang="ts">
import ColorTextField from "./ColorTextField.vue";
import { type PropType, ref, watch, computed } from "vue";
import type { Section } from "~/types";
import axios from "~/helpers/RequestHelper";
import { useSpecStore } from "~/store/SpecStore";


const props = defineProps({
  editSection: {
    type: Object as PropType<Section | null>,
  },
});

const specStore = useSpecStore();

const currentPage = computed(() => {
  return specStore.generatedPages[specStore.currentGeneratedPageIndex];
});

interface SectionSuggestion {
  Section_Position_on_Page: string;
  Component_Layout_in_Section: string;
  Color_Scheme: string;
}

const section = ref<SectionSuggestion>({
  Section_Position_on_Page: "",
  Component_Layout_in_Section: "",
  Color_Scheme: ""
});

watch(
  () => props.editSection,
  () => {
    section.value = {
      Section_Position_on_Page: "",
      Component_Layout_in_Section: "",
      Color_Scheme: ""
    };
  },
  { immediate: true }
);

const editKeys: (keyof SectionSuggestion)[] = [
  "Section_Position_on_Page",
  "Component_Layout_in_Section",
  "Color_Scheme",
];

function edit(section: SectionSuggestion) {
  console.log("Edit section:", section);
  let text = `用户想要更改path为Page_Composition/Sections中Data_Section_Id为${specStore.selectedSection?.Data_Section_Id}的组件，`;

  for (let key of editKeys) {
    if ((section[key] as string).trim() != "") {
      text += `${key}的更改意图为: ${section[key]}, `;
    }
  }
  let payload = {
    spec: currentPage.value.spec,
    text: text,
  };
  console.log(payload);
  axios.post("/edit_spec", payload).then((response) => {
    if (response.data.success) {
      currentPage.value.spec = response.data.data.spec;
      currentPage.value.code = response.data.data.extracted_code;
      console.log("edit spec success:", response.data);
    }
  });
}
</script>

<template>
  <v-container v-if="editSection">
    <v-card width="350" elevation="5">
      <v-card-title class="d-flex align-center text-body-2">
        Attributes - &nbsp
        <strong>{{ editSection.Section_Name }}</strong>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text style="max-height: 80vh; overflow: auto;">
        <h1 class="text-h6 font-weight-bold mb-2">Component Layout</h1>
        <v-textarea
          v-model="editSection.Component_Layout_in_Section"
          density="compact"
          rows="1"
          auto-grow
          readonly
          variant="solo-filled"
        ></v-textarea>

        <v-text-field
          v-model="section.Component_Layout_in_Section"
          density="compact"
          label="Function Suggestion"
          placeholder="Describe the function of the component"
          variant="outlined"
        ></v-text-field>

        <h1 class="text-h6 font-weight-bold mb-2">Color Scheme</h1>

        <ColorTextField v-model="editSection.Color_Scheme" class="mb-4" />

        <v-text-field
          v-model="section.Color_Scheme"
          density="compact"
          label="Color Suggestion"
          placeholder="Describe the function of the component"
          variant="outlined"
        ></v-text-field>

        <h1 class="text-h6 font-weight-bold mb-2">Layout Style</h1>

        <v-textarea
          v-model="editSection.Section_Position_on_Page"
          rows="1"
          auto-grow
          variant="solo-filled"
          readonly
        ></v-textarea>

        <v-text-field
          v-model="section.Section_Position_on_Page"
          density="compact"
          label="Layout Suggestion"
          placeholder="Describe the function of the component"
          variant="outlined"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="edit(section)"
          >Edit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>
