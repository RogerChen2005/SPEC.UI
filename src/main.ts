import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useDarkMode } from "./composables/useDarkMode.ts";
import "./style/basic.scss";
import "./style/global.scss";

import "vuetify/dist/vuetify.min.css";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { generateTheme } from "./composables/useTheme.ts";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: generateTheme(),
  },
});

if (vuetify.theme.themes.value.dark) {
  vuetify.theme.themes.value.dark.colors.background = '#1f1e1eff';
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

useDarkMode();

export const context = app._context;

app.mount("#app");