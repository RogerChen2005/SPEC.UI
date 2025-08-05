import { defineStore } from "pinia";
import { ref } from "vue";
import type { GeneratedImage, SPEC, UploadImage, Component, DesignSpec, Reference } from "~/types/index";
import initial_spec from "~/example/generate_spec.json";
import initial_reference from "~/example/reference.json";
import generated_spec from "~/example/generatedUI.json";
import {render_image} from "~/example/render_image";
import { imageGenerationUtil } from "~/helpers/ReferenceHelper";

interface Initial_Spec {
  specs: SPEC[];
}
interface Initial_Reference {
  references: Reference[];
}

export const useSpecStore = defineStore("spec", () => {
  const uploadedPages = ref<UploadImage[]>([
    {
      id: "0",
      name: "Sample Image",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui1.png",
      analysisComplete: true,
      spec: (initial_spec as Initial_Spec).specs[0],
      reference: (initial_reference as Initial_Reference).references[0],
    },
    {
      id: "1",
      name: "Sample Image 2",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui2.png",
      analysisComplete: true,
      spec: (initial_spec as Initial_Spec).specs[1],
      reference: (initial_reference as Initial_Reference).references[1],
    },
    {
      id: "2",
      name: "Sample Image 3",
      url: "https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui3.png",
      analysisComplete: true,
      spec: (initial_spec as Initial_Spec).specs[2],
      reference: (initial_reference as Initial_Reference).references[2],
    },
  ]);
  const generatedPages = ref<GeneratedImage[]>([
    {
      spec: generated_spec as SPEC,
      generating: false,
      render_image: "data:image/png;base64," + render_image,
    }
  ]);
  const currentGeneratedPageIndex = ref<number>(0);
  const selectedUploadedImage = ref<UploadImage>();
  const selectedComponent = ref<Component>();
  const promptText = ref("");
  const draggingInfo = ref({
    isDragging: false,
    selectedPageIndex: 0,
  });
  const currentUploadedPageIndex = ref<number>(-1);

  const designSpecs = ref<DesignSpec>({
    "Color": { icon: "mdi-palette-outline", value: -1 },
    "Information": { icon: "mdi-information-outline", value: -1 },
    "Layout": { icon: "mdi-layers-outline", value: -1 },
  });

  function generateImage() {
    imageGenerationUtil(uploadedPages, generatedPages, promptText, designSpecs);
  }

  function updateComponentInCurrentPage(component: Component) {
    const currentPage = generatedPages.value[currentGeneratedPageIndex.value];
    if(currentPage && currentPage.spec) {
      currentPage.spec.PageStructure.SectionDivision.forEach(region => {
      const componentIndex = region.ContainedComponents.findIndex(
        comp => comp.ComponentID === component.ComponentID
      );
      
      if (componentIndex !== -1) {
        region.ContainedComponents[componentIndex] = component;
      }
    });
    }
  }

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
    generateImage,
    updateComponentInCurrentPage,
  };
});
