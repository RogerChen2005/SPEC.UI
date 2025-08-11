import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  GeneratedImage,
  SPEC,
  UploadImage,
  Component,
  DesignSpec,
} from "~/types/index";
import initial_spec from "~/example/generate_spec.json";
import generated_spec from "~/example/generatedUI.json";
import { render_image } from "~/example/render_image";
import { imageGenerationUtil } from "~/helpers/ReferenceHelper";

interface Initial_Spec {
  specs: SPEC[];
}

export const useSpecStore = defineStore("spec", () => {
  const uploadedPages = ref<UploadImage[]>([
    {
      id: "0",
      name: "Sample Image",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui1.png",
      analysisComplete: true,
      spec: (initial_spec as Initial_Spec).specs[0],
    },
    {
      id: "1",
      name: "Sample Image 2",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui2.png",
      analysisComplete: true,
      spec: (initial_spec as Initial_Spec).specs[1],
    },
    {
      id: "2",
      name: "Sample Image 3",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui3.png",
      analysisComplete: true,
      spec: (initial_spec as Initial_Spec).specs[2],
    },
    {
      id: "3",
      name: "Sample Image 4",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui4.png",
      analysisComplete: true,
      spec: (initial_spec as Initial_Spec).specs[3],
    },
  ]);
  const generatedPages = ref<GeneratedImage[]>([
    {
      spec: generated_spec as SPEC,
      generating: true,
      render_image: "data:image/png;base64," + render_image,
    },
    {
      spec: generated_spec as SPEC,
      generating: false,
      render_image: "data:image/png;base64," + render_image,
    },
    {
      spec: generated_spec as SPEC,
      generating: true,
      render_image: "data:image/png;base64," + render_image,
    },
  ]);
  const currentGeneratedPageIndex = ref<number>(0);
  const selectedUploadedImage = ref<UploadImage>();
  const selectedComponent = ref<Component>();
  const promptText = ref("");
  const draggingInfo = ref({
    isDragging: false,
    selectedPageIndex: 0,
  });
  const currentUploadedPageIndex = ref<number>(uploadedPages.value.length - 1);

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
    imageGenerationUtil(uploadedPages, generatedPages, promptText, designSpecs);
  }

  // function updateComponentInCurrentPage(component: Component) {
  //   const currentPage = generatedPages.value[currentGeneratedPageIndex.value];
  //   if (currentPage && currentPage.spec) {
  //     currentPage.spec.Page_Composition.Sections.forEach((region) => {
  //       const componentIndex = region.Contained_Components.findIndex(
  //         (comp) => comp === component.ComponentID
  //       );

  //       if (componentIndex !== -1) {
  //         region.ContainedComponents[componentIndex] = component;
  //       }
  //     });
  //   }
  // }

  return {
    currentUploadedPageIndex,
    uploadedPages,
    generatedPages,
    currentGeneratedPageIndex,
    selectedUploadedImage,
    selectedComponent,
    designSpecs,
    promptText,
    draggingInfo,
    pageCompositionReference,
    generateImage,
    // updateComponentInCurrentPage,
  };
});
