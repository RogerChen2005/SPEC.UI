<script setup lang="ts">
import { computed } from "vue";
import { imageUploadUtil } from "~/helpers/ReferenceHelper";
import { useSpecStore } from "~/store/SpecStore";

const specStore = useSpecStore();
const currentPage = computed({
  get: () => specStore.currentUploadedPageIndex,
  set: (val) => {
    specStore.currentUploadedPageIndex = val;
  },
});
const uploadedPages = computed(() => specStore.uploadedPages);
const DraggingInfo = computed(() => specStore.draggingInfo);

function uploadImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg, image/png";
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      imageUploadUtil(uploadedPages, file, currentPage);
    }
  };
  input.click();
}

function onSelectImage(index: number) {
  DraggingInfo.value.isDragging = true;
  DraggingInfo.value.selectedPageIndex = index;
}

function onDragEnd() {
  DraggingInfo.value.isDragging = false;
}

function nextPageUploaded() {
  currentPage.value = (currentPage.value + 1) % uploadedPages.value.length;
}

function prevPageUploaded() {
  currentPage.value =
    (currentPage.value - 1 + uploadedPages.value.length) %
    uploadedPages.value.length;
}
</script>

<template>
  <v-row align="center" class="mt-2 mb-2">
    <v-col>
      <h2 class="text-h5 font-weight-bold">Uploaded Pages</h2>
    </v-col>
    <v-col cols="auto">
      <v-btn
        @click="uploadImage"
        color="primary"
        width="150"
        variant="flat"
        class="text-none"
        >Add</v-btn
      >
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="1" class="d-flex align-center justify-center">
      <v-btn
        variant="tonal"
        icon="mdi-arrow-left"
        @click="prevPageUploaded"
      ></v-btn>
    </v-col>
    <v-col cols="10">
      <v-carousel
        v-if="uploadedPages.length > 0"
        v-model="currentPage"
        height="400"
        progress="red"
        vertical-arrows="left"
        hide-delimiters
        :show-arrows="false"
        class="rounded uploaded-page"
        @dragstart="() => onSelectImage(currentPage)"
        @dragend="onDragEnd"
        draggable="true"
      >
        <v-carousel-item v-for="(page, index) in uploadedPages" :key="index">
          <template v-if="page.analysisComplete">
            <v-img :src="page.url"></v-img>
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
              <span>Analyzing image...</span>
            </v-sheet>
          </template>
        </v-carousel-item>

        <v-overlay
          :scrim="false"
          content-class="w-100 h-100 d-flex flex-column align-center pointer-pass-through justify-space-between py-3"
          contained
          model-value
          no-click-animation
          persistent
        >
          <v-scroll-x-transition mode="out-in" appear>
            <v-sheet
              :key="currentPage"
              rounded="xl"
              class="pointer-events-auto d-flex align-center justify-center pa-2 pl-4 pr-4"
            >
              Image {{ currentPage + 1 }}
            </v-sheet>
          </v-scroll-x-transition>
          <v-chip
            :text="`${currentPage + 1} / ${uploadedPages.length}`"
            size="small"
            variant="elevated"
            class="pointer-events-auto"
          ></v-chip>
        </v-overlay>
      </v-carousel>

      <v-sheet
        v-else
        height="400"
        class="rounded d-flex align-center justify-center"
        color="surface-variant"
      >
        <div class="text-center">
          <v-icon icon="mdi-image-outline" size="large" class="mb-2"></v-icon>
          <div>Upload a page to start...</div>
        </div>
      </v-sheet>
    </v-col>

    <v-col cols="1" class="d-flex align-center justify-center">
      <v-btn
        variant="tonal"
        icon="mdi-arrow-right"
        @click="nextPageUploaded"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
.uploaded-page:hover {
  background: rgba(var(--v-theme-on-surface), 0.1);
  cursor: grab;
}
</style>
