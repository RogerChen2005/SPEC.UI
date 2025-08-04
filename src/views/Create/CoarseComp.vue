<template>
  <v-row>
    <v-col class="pa-4 pt-2">
      <UploadedPages></UploadedPages>
      <GeneratedPages></GeneratedPages>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import GeneratedPages from "~/components/GeneratedPages.vue";
import UploadedPages from "~/components/UploadedPages.vue";
</script>
