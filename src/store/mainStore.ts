import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ThemePreference } from '~/types/index';
import {v4} from 'uuid';

export const useMainStore = defineStore('main', () => {
  const isDarkMode = ref<boolean>(false); // Add isDarkMode state
  const ThemePreference = ref<ThemePreference>(localStorage.getItem('themePreference') as ThemePreference || 'system');
  const ColorPreference = ref<string>(localStorage.getItem('colorPreference') || 'default');
  const userId = ref<string>('');

  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value;
  };

  const setPreferences = (theme: ThemePreference, color: string) => {
    ThemePreference.value = theme;
    ColorPreference.value = color;
    localStorage.setItem('themePreference', theme);
    localStorage.setItem('colorPreference', color);
  }

  const loadUserId = () => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      userId.value = storedUserId;
    } else {
      userId.value = v4();
      localStorage.setItem('userId', userId.value);
    }
    console.log('User ID:', userId.value);
  }

  loadUserId();
  
  return {
    userId,
    ThemePreference,
    ColorPreference,
    setDarkMode,
    isDarkMode,
    setPreferences
  };
});