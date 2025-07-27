<template>
  <div class="d-flex align-center mb-4">
    <span class="text-h6 font-weight-bold">Brand Logo</span>
    <v-spacer></v-spacer>
    <v-icon icon="mdi-chevron-down" class="ml-2"></v-icon>
  </div>
  <v-divider></v-divider>

  <v-list density="compact" lines="one" class="py-0">
    <v-list-item v-for="item in propertyLinks" :key="item.label" class="pl-0">
      <template v-slot:prepend>
        <v-icon :icon="item.icon" class="mr-3"></v-icon>
      </template>
      <v-list-item-title>{{ item.label }}</v-list-item-title>
      <template v-slot:append>
        <v-chip :closable="item.value !== 'None'" size="small" variant="tonal" @click:close="item.value = 'None'">
          {{ item.value }}
        </v-chip>
      </template>
    </v-list-item>
  </v-list>
  <v-divider class="mb-4"></v-divider>

  <v-btn color="primary" block size="large" class="text-capitalize mb-2">
    Upload Reference Pages
  </v-btn>
  <p class="text-caption text-grey text-center mb-4">
    For partial reference, upload the relevant section instead of the full page.
  </p>

  <v-card variant="tonal" class="pa-4">
    <h3 class="text-body-1 font-weight-bold mb-3">My Reference Pages</h3>
    <v-row dense>
      <v-col v-for="img in referenceImages" :key="img.id" cols="6">
        <v-card flat border>
          <v-img :src="img.src" height="100" cover class="align-end text-white"></v-img>
          <div class="text-body-2 text-center py-1 bg-grey-lighten-4">
            {{ img.label }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 属性链接的数据
const propertyLinks = ref([
  { icon: 'mdi-function-variant', label: 'Function', value: 'None' },
  { icon: 'mdi-information-outline', label: 'Displayed Information', value: 'img 1' },
  { icon: 'mdi-palette-outline', label: 'Color Style & Layout', value: 'img 3' },
  { icon: 'mdi-map-marker-outline', label: 'Position', value: 'img 2' },
  { icon: 'mdi-view-dashboard-outline', label: 'Layout Style', value: 'img 9' },
]);

// 参考图片的数据
// 在实际项目中，您应该使用真实的图片URL
const referenceImages = ref([
  { id: 1, label: 'img 1', src: 'https://cdn.vuetifyjs.com/images/stock/photo-1542382257-80dedb7ca0ce.jpg' },
]);
</script>