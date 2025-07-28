import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ThemePreference } from '~/types';

export const useMainStore = defineStore('main', () => {
  const isDarkMode = ref<boolean>(false); // Add isDarkMode state
  const ThemePreference = ref<ThemePreference>(localStorage.getItem('themePreference') as ThemePreference || 'system');
  const ColorPreference = ref<string>(localStorage.getItem('colorPreference') || 'default');

  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value;
  };

  const setPreferences = (theme: ThemePreference, color: string) => {
    ThemePreference.value = theme;
    ColorPreference.value = color;
    localStorage.setItem('themePreference', theme);
    localStorage.setItem('colorPreference', color);
  }
  
  return {
    ThemePreference,
    ColorPreference,
    setDarkMode,
    isDarkMode,
    setPreferences
  };
});