<script setup lang="ts">
import { useVuetifyTheme } from './composables/useVuetifyTheme';
useVuetifyTheme();
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>

