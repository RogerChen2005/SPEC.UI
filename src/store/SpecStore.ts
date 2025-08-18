import { defineStore } from "pinia";
import { ref, nextTick } from "vue";
import type {
  GeneratedImage,
  UploadImage,
  Component,
  DesignSpec,
  Section,
  LibraryInfo,
} from "~/types";
import { imageGenerationUtil } from "~/helpers/ReferenceHelper";

// import { CompleteStatus } from "~/enums";
// // import upload_spec from "~/example/upload_spec.json";
// import generate_spec from "~/example/generate_spec.json";
// import generate_code from "~/example/generate_code_1.json";
// import { v4 } from "uuid";

// interface upload_spec {
//   specs: SPEC[];
// }

export const useSpecStore = defineStore("spec", () => {
  const uploadedPages = ref<UploadImage[]>([]);
  const customUploadedPages = ref<UploadImage[]>([]);
  const generatedPages = ref<GeneratedImage[]>([
  ]);
  const specLibrary = ref<LibraryInfo[]>([
    {
      name: "Task1-Region",
      label: "For Region Testing",
      path: "task1",
      selected: false,
      pages: [],
    },
    {
      name: "Task2-Region",
      label: "For Region Testing",
      path: "task2",
      selected: false,
      pages: [],
    },
    {
      name: "Task1-Style",
      label: "For Style Testing",
      path: "task1_s",
      selected: false,
      pages: [],
    },
    {
      name: "Task2-Region",
      label: "For Style Testing",
      path: "task2_s",
      selected: false,
      pages: [],
    },
  ]);
  const currentGeneratedPageIndex = ref<number>(0);
  const selectedUploadedImage = ref<UploadImage>();
  const selectedComponent = ref<Component>();
  const currentUploadedPageIndex = ref<number>(uploadedPages.value.length - 1);
  const selectedSection = ref<Section>();
  const tab = ref("1");

  const designSpecs = ref<DesignSpec>({
    Color_System: {
      label: "Color System",
      icon: "mdi-palette-outline",
      value: -2,
      customPrompt: "",
    },
    Usage_Scenario: {
      label: "Usage Scenario",
      icon: "mdi-information-outline",
      value: -2,
      customPrompt: "",
    },
    Layout_Structure: {
      label: "Layout Structure",
      icon: "mdi-layers-outline",
      value: -2,
      customPrompt: "",
    },
    Shape_Language: {
      label: "Shape Language",
      icon: "mdi-shape-outline",
      value: -2,
      customPrompt: "",
    },
  });

  const pageCompositionReference = ref<number[]>([]);

  function clearSpecSelection() {
    designSpecs.value.Color_System.value = -2;
    designSpecs.value.Layout_Structure.value = -2;
    designSpecs.value.Shape_Language.value = -2;
    designSpecs.value.Usage_Scenario.value = -2;
    pageCompositionReference.value = [];
  }

  function generateImage() {
    imageGenerationUtil(
      uploadedPages,
      generatedPages,
      pageCompositionReference,
      designSpecs,
      () => {
        nextTick(() => {
          currentGeneratedPageIndex.value = generatedPages.value.length - 1;
        });
      }
    );
  }

  return {
    customUploadedPages,
    currentUploadedPageIndex,
    currentGeneratedPageIndex,
    uploadedPages,
    generatedPages,
    selectedUploadedImage,
    selectedComponent,
    specLibrary,
    tab,
    designSpecs,
    pageCompositionReference,
    selectedSection,
    generateImage,
    clearSpecSelection,
  };
});
