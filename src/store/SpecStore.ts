import { defineStore } from "pinia";
import { ref, nextTick } from "vue";
import type {
  GeneratedImage,
  SPEC,
  UploadImage,
  Component,
  DesignSpec,
  Section,
} from "~/types";

import { CompleteStatus } from "~/enums";
import upload_spec from "~/example/upload_spec.json";
import generate_spec from "~/example/generate_spec.json";
import generate_code from "~/example/generate_code_1.json";
import { imageGenerationUtil } from "~/helpers/ReferenceHelper";
import { v4 } from "uuid";

interface upload_spec {
  specs: SPEC[];
}

export const useSpecStore = defineStore("spec", () => {
  const uploadedPages = ref<UploadImage[]>([
    {
      id: v4(),
      name: "Sample Image",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui1.png",
      complete: CompleteStatus.Complete,
      spec: (upload_spec as upload_spec).specs[0],
    },
    {
      id: v4(),
      name: "Sample Image 2",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui2.png",
      complete: CompleteStatus.Complete,
      spec: (upload_spec as upload_spec).specs[1],
    },
    {
      id: v4(),
      name: "Sample Image 3",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui3.png",
      complete: CompleteStatus.Complete,
      spec: (upload_spec as upload_spec).specs[2],
    },
    {
      id: v4(),
      name: "Sample Image 4",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui4.png",
      complete: CompleteStatus.Complete,
      spec: (upload_spec as upload_spec).specs[3],
    },
  ]);
  const generatedPages = ref<GeneratedImage[]>([
    {
      id: v4(),
      spec: generate_spec.specs[0] as SPEC,
      complete: CompleteStatus.Complete,
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/generated_ui1.png",
      time: new Date(),
      reference: 0,
      code: generate_code.code,
    },
    {
      id: v4(),
      spec: generate_spec.specs[0]  as SPEC,
      complete: CompleteStatus.Complete,
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/generated_ui2.png",
      time: new Date(),
      reference: 1,
      code: generate_code.code,
    },
    {
      id: v4(),
      spec: generate_spec.specs[0]  as SPEC,
      complete: CompleteStatus.Error,
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/generated_ui2.png",
      time: new Date(),
      reference: 1,
      code: generate_code.code,
    },
  ]);
  const currentGeneratedPageIndex = ref<number>(0);
  const selectedUploadedImage = ref<UploadImage>();
  const selectedComponent = ref<Component>();
  const currentUploadedPageIndex = ref<number>(uploadedPages.value.length - 1);
  const selectedSection = ref<Section>();
  const tab = ref("2");

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

  const pageCompositionReference = ref(-1);

  function generateImage() {
    imageGenerationUtil(
      uploadedPages,
      generatedPages,
      pageCompositionReference,
      designSpecs,()=>{
        nextTick(()=>{
          currentGeneratedPageIndex.value = generatedPages.value.length - 1;
        })
      }
    );
  }

  return {
    currentUploadedPageIndex,
    currentGeneratedPageIndex,
    uploadedPages,
    generatedPages,
    selectedUploadedImage,
    selectedComponent,
    tab,
    designSpecs,
    pageCompositionReference,
    selectedSection,
    generateImage,
  };
});
