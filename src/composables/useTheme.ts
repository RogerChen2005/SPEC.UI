import { type ThemeDefinition } from "vuetify";
import colors from "vuetify/util/colors";

function createTheme(color: any): ThemeDefinition {
  return {
    colors: {
      primary: color.darken2,
      secondary: color.darken1,
      accent: color.darken3,
      info: color.base,
      background: color.lighten5,
      surface: color.lighten4,
    },
    dark: false,
    variables: {
      font: color.darken4,
    },
  };
}

function createDarkTheme(color: any): ThemeDefinition {
  return {
    colors: {
      primary: color.lighten2,
      secondary: color.lighten3,
      accent: color.lighten1,
      info: color.base,
      background: color.darken3,
      surface: color.darken4,
    },
    dark: true,
    variables: {
      "border-color": color.lighten3,
      "theme-colors-opacity": 0.8,
    },
  };
}

export function generateTheme(): Record<string, ThemeDefinition> {
  const themes: Record<string, ThemeDefinition> = {};

  for (const key in colors) {
    if (key != "shades") {
      themes[`light-${key}`] = createTheme(colors[key as keyof typeof colors]);
      themes[`dark-${key}`] = createDarkTheme(
        colors[key as keyof typeof colors]
      );
    }
  }

  return themes;
}

// export default createVuetify({
//   theme: {
//     defaultTheme: "light-teal",
//     themes: generateTheme(),
//   },
// });
