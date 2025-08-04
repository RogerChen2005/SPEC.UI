<template>
  <v-row>
    <v-col>
      <h2 class="text-h5 font-weight-bold">Generated Pages</h2>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="1" class="d-flex align-center justify-center">
      <v-btn
        variant="tonal"
        icon="mdi-arrow-left"
        @click="prevPageGenerated"
      ></v-btn>
    </v-col>
    <v-col cols="10">
      <v-carousel
        v-if="generatedPages.length > 0"
        v-model="currentPage"
        height="400"
        vertical-arrows="left"
        hide-delimiters
        :show-arrows="false"
        class="rounded uploaded-page"
      >
        <v-carousel-item v-for="(page, index) in generatedPages" :key="index">
          <template v-if="!page.generating && page.render_image">
            <!-- <v-img :src="page.render_image"></v-img> -->
            <SmoothPicture :url="page.render_image"></SmoothPicture>
          </template>
          <template v-else>
            <v-sheet
              class="d-flex flex-column align-center justify-center"
              height="100%"
            >
              <v-progress-circular
                indeterminate
                color="primary"
                class="mb-2"
              ></v-progress-circular>
              <span>Generating UI...</span>
            </v-sheet>
          </template>
        </v-carousel-item>
      </v-carousel>
      <v-sheet
        v-else
        height="400"
        class="rounded d-flex align-center justify-center"
        color="surface-variant"
      >
        <div class="text-center">
          <v-icon icon="mdi-image-outline" size="large" class="mb-2"></v-icon>
          <div>No UI Generated...</div>
        </div>
      </v-sheet>
    </v-col>
    <v-col cols="1" class="d-flex align-center justify-center">
      <v-btn
        variant="tonal"
        icon="mdi-arrow-right"
        @click="nextPageGenerated"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { watch, computed, ref } from "vue";
import SmoothPicture from "~/components/SmoothPicture.vue";
import { useSpecStore } from "~/store/SpecStore";

const specStore = useSpecStore();
const generatedPages = computed(() => specStore.generatedPages);

const currentPage = ref(0);

watch(
  generatedPages,
  () => {
    generatedPages.value.length > 0
      ? (currentPage.value = generatedPages.value.length - 1)
      : (currentPage.value = 0);
  },
  { immediate: true }
);

function nextPageGenerated() {
  currentPage.value =
    (currentPage.value + 1) % generatedPages.value.length;
}

function prevPageGenerated() {
  currentPage.value =
    (currentPage.value - 1 + generatedPages.value.length) %
    generatedPages.value.length;
}
</script>
