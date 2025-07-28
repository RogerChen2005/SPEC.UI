import { watchEffect } from 'vue';
import { useTheme } from 'vuetify';
import { useMainStore } from '~/store/mainStore';
import type { ThemePreference } from '~/types';

export function useVuetifyTheme() {
  const theme = useTheme();
  const store = useMainStore();

  const setVuetifyTheme = (themePreference: ThemePreference, colorPreference: string) => {
    let preferTheme =  themePreference;
    if (preferTheme === 'system') {
      preferTheme = store.isDarkMode ? 'dark' : 'light';
    }
    let themeName = colorPreference !== 'default' ? `${preferTheme}-${colorPreference}` : preferTheme;
    console.log(themeName)
    theme.global.name.value = themeName;
  };

  setVuetifyTheme(store.ThemePreference, store.ColorPreference);

  watchEffect(()=>{
    setVuetifyTheme(store.ThemePreference, store.ColorPreference);
  })
}