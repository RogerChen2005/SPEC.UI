import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GeneratedImage, SPEC, UploadImage } from '~/types/index';
import initial_spec from "~/example/generate_spec.json"

interface Initial_Spec {
  specs: SPEC[];
}

export const useSpecStore = defineStore('spec', () => {
  const uploadedPages = ref<UploadImage[]>([{
        id: '0',
        name: 'Sample Image',
        url: 'https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui1.png',
        analysisComplete: true,
        spec: (initial_spec as Initial_Spec).specs[0]
    },{
        id: '1',
        name: 'Sample Image 2',
        url: 'https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui2.png',
        analysisComplete: true,
        spec: (initial_spec as Initial_Spec).specs[1]
    },
  {
        id: '2',
        name: 'Sample Image 3',
        url: 'https://pub-3e35661d2fc44d53ab77988f4adbc462.r2.dev/ui3.png',
        analysisComplete: true,
        spec: (initial_spec as Initial_Spec).specs[1]
    }]);
  const generatedPages = ref<GeneratedImage[]>([]);
  return {
    uploadedPages,
    generatedPages
  };
});