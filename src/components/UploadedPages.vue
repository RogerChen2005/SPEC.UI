<script setup lang="ts">
import { computed, onMounted, ref, type ComponentPublicInstance, nextTick } from "vue";
import { imageUploadUtil } from "~/helpers/ReferenceHelper";
import { useSpecStore } from "~/store/specStore";
import CDialog from "./UI/CDialog.vue";
import DetailedDialog from "./DetailedDialog.vue";

const specStore = useSpecStore();
const currentPage = computed({
  get: () => specStore.currentUploadedPageIndex,
  set: (val) => {
    specStore.currentUploadedPageIndex = val;
  },
});
const viewingPage = ref(0);
const uploadedPages = computed(() => specStore.uploadedPages);
const CardRef = ref<InstanceType<typeof Element>[]>([]);
const dialogOpened = ref(false);

function uploadImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg, image/png";
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      imageUploadUtil(uploadedPages, file, () => {
        nextTick(() => {
          currentPage.value = uploadedPages.value.length - 1;
          updateActiveSlide();
        });
      },()=>{
        openDialog(uploadedPages.value.length - 1);
      });
    }
  };
  input.click();
}

function openDialog(index: number) {
  viewingPage.value = index;
  dialogOpened.value = true;
}

function nextPageUploaded() {
  currentPage.value = (currentPage.value + 1) % uploadedPages.value.length;
  updateActiveSlide();
}

function prevPageUploaded() {
  currentPage.value =
    (currentPage.value - 1 + uploadedPages.value.length) %
    uploadedPages.value.length;
  updateActiveSlide();
}

function updateActiveSlide() {
  CardRef.value[currentPage.value].scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}

function setCardRef(el: ComponentPublicInstance | Element | null, index: number) {
  if (el) {
    CardRef.value[index] = el as Element;
  }
}

onMounted(() => {
  updateActiveSlide();
});
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

  <v-sheet variant="tonal" class="pa-4 rounded-lg">
    <v-row align="center">
      <v-col cols="1" class="d-flex justify-center">
        <v-btn
          variant="tonal"
          icon="mdi-arrow-left"
          @click="prevPageUploaded"
          class="mx-2"
        ></v-btn>
      </v-col>
      <v-col cols="10" class="slider">
        <template v-if="uploadedPages.length !== 0">
          <div class="slide"></div>
          <div
            v-for="(page, index) in uploadedPages"
            :ref="(el)=>setCardRef(el,index)"
            :key="index"
            class="slide"
          >
            <v-card @click="openDialog(index)" link class="uploaded-page" :class="{
              'current-page': currentPage === index
            }">
              <template v-if="page.complete">
                <v-img :src="page.url" height="400px" cover></v-img>
              </template>
              <template v-else>
                <v-sheet
                  class="d-flex flex-column align-center justify-center"
                  height="400px"
                >
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    class="mb-2"
                  ></v-progress-circular>
                  <span>Analyzing image...</span>
                </v-sheet>
              </template>
              <v-overlay
                v-if="index === currentPage"
                :model-value="true"
                class="d-flex align-end justify-center"
                scrim="transparent"
                contained
              >
                <v-chip
                  :text="`${index + 1} / ${uploadedPages.length}`"
                  size="small"
                  variant="elevated"
                  class="mb-2"
                ></v-chip>
              </v-overlay>
            </v-card>
          </div>
          <div class="slide"></div>
        </template>

        <template v-else>
          <v-sheet
            height="400"
            class="rounded d-flex align-center justify-center"
            color="surface-variant"
          >
            <div class="text-center">
              <v-icon
                icon="mdi-image-outline"
                size="large"
                class="mb-2"
              ></v-icon>
              <div>Upload a page to start...</div>
            </div>
          </v-sheet>
        </template>
      </v-col>

      <v-col cols="1" class="d-flex justify-center">
        <v-btn
          variant="tonal"
          icon="mdi-arrow-right"
          @click="nextPageUploaded"
          class="mx-2"
        ></v-btn>
      </v-col>
    </v-row>
  </v-sheet>

  <teleport to="body">
    <CDialog v-model:visible="dialogOpened" width="80%" height="80%">
      <template #header>
        <h2 class="text-h6 ml-4">Reference Page</h2>
        <h2 class="text-h4 font-weight-bold ml-4">
          {{ uploadedPages[viewingPage]?.name || "Page Details" }}
        </h2>
      </template>
      <DetailedDialog :page-index="viewingPage" @close="dialogOpened = false">
      </DetailedDialog>
    </CDialog>
  </teleport>
</template>

<style scoped>
.uploaded-page:hover {
  background: rgba(var(--v-theme-on-surface), 0.1);
  cursor: grab;
}

.slider {
  display: flex;
  overflow-x: auto;

  scroll-snap-type: x mandatory;

  scrollbar-width: none;
  -ms-overflow-style: none;

  gap: 30px;
}

.slider::-webkit-scrollbar {
  display: none;
}

.slide {
  flex-shrink: 0;
  width: 700px;
  /* height: 300px; */
  border-radius: 10px;

  scroll-snap-align: center;
}

.uploaded-page {
  border: solid 6px rgba(var(--v-border-color), 0);
}

.current-page{
  border: solid 6px rgba(var(--v-border-color), 0.2);
}
</style>
