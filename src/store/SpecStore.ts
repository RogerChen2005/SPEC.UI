import { defineStore } from "pinia";
import { ref, nextTick } from "vue";
import type {
  GeneratedImage,
  SPEC,
  UploadImage,
  Component,
  DesignSpec,
  Section,
} from "~/types/index";
import upload_spec from "~/example/upload_spec.json";
import generate_spec from "~/example/generate_spec.json";
import generate_code from "~/example/generate_code.json";
import { imageGenerationUtil } from "~/helpers/ReferenceHelper";

interface upload_spec {
  specs: SPEC[];
}

export const useSpecStore = defineStore("spec", () => {
  const uploadedPages = ref<UploadImage[]>([
    {
      id: "0",
      name: "Sample Image",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui1.png",
      complete: true,
      spec: (upload_spec as upload_spec).specs[0],
    },
    {
      id: "1",
      name: "Sample Image 2",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui2.png",
      complete: true,
      spec: (upload_spec as upload_spec).specs[1],
    },
    {
      id: "2",
      name: "Sample Image 3",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui3.png",
      complete: true,
      spec: (upload_spec as upload_spec).specs[2],
    },
    {
      id: "3",
      name: "Sample Image 4",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui4.png",
      complete: true,
      spec: (upload_spec as upload_spec).specs[3],
    },
  ]);
  const generatedPages = ref<GeneratedImage[]>([
    {
      spec: generate_spec.specs[0] as SPEC,
      complete: true,
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/generated_ui1.png",
      time: new Date(),
      reference: 0,
      code: generate_code.code,
    },
    {
      spec: generate_spec.specs[0]  as SPEC,
      complete: true,
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/generated_ui2.png",
      time: new Date(),
      reference: 1,
      code: generate_code.code,
    },
    {
      spec: generate_spec.specs[0]  as SPEC,
      complete: false,
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
      value: -1,
    },
    Usage_Scenario: {
      label: "Usage Scenario",
      icon: "mdi-information-outline",
      value: -1,
    },
    Layout_Structure: {
      label: "Layout Structure",
      icon: "mdi-layers-outline",
      value: -1,
    },
    Shape_Language: {
      label: "Shape Language",
      icon: "mdi-shape-outline",
      value: -1,
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
