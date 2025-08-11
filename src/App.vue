<script setup lang="ts">
import { useVuetifyTheme } from './composables/useVuetifyTheme';
import { useMessageStore } from './store/messageStore';

useVuetifyTheme();
const messages = useMessageStore();
</script>

<template>
  <v-app>
    <router-view />
    <v-snackbar-queue v-model="messages.queue" location="top center" z-index="2000"></v-snackbar-queue>
  </v-app>
</template>

