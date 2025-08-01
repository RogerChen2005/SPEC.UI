import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SPEC, UploadImage } from '~/types';
import initial_spec from "~/example/generate_spec.json"

export const useSpecStore = defineStore('spec', () => {
  const uploadedPages = ref<UploadImage[]>([{
        id: '0',
        name: 'Sample Image',
        url: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        analysisComplete: true,
        spec: initial_spec as SPEC
    },{
        id: '1',
        name: 'Sample Image 2',
        url: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
        analysisComplete: true,
    }]);
  
  return {
    uploadedPages
  };
});