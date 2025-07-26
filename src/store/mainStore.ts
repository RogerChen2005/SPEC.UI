import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMainStore = defineStore('main', () => {
  const isDarkMode = ref<boolean>(false); // Add isDarkMode state

  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value;
  };
  
  return {
    setDarkMode,
    isDarkMode
  };
});