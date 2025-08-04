import { defineStore } from "pinia";
import { ref } from "vue";
import type { GeneratedImage, SPEC, UploadImage, Component } from "~/types/index";
import initial_spec from "~/example/generate_spec.json";
import generated_spec from "~/example/generatedUI.json";
import {render_image} from "~/example/render_image";
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
  const DraggingInfo = ref({
    isDragging: false,
    selectedPageIndex: 0,
  });

  const designSpecs = ref([
    { icon: "mdi-palette-outline", label: "Color", value: -1 },
    { icon: "mdi-information-outline", label: "Information", value: -1 },
    { icon: "mdi-layers-outline", label: "Layout", value: -1 },
  ]);

  function generateImage() {
    imageGenerationUtil(uploadedPages, generatedPages, promptText, designSpecs);
  }

  return {
    uploadedPages,
    generatedPages,
    currentGeneratedPageIndex,
    selectedUploadedImage,
    selectedComponent,
    designSpecs,
    promptText,
    DraggingInfo,
    generateImage,
  };
});
