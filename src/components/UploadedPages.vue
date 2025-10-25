<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  type ComponentPublicInstance,
  nextTick,
} from "vue";
import { imageUploadUtil } from "~/helpers/ReferenceHelper";
import { useSpecStore } from "~/store/SpecStore";
import CDialog from "./CUI/CDialog.vue";
import DetailedDialog from "./DetailedDialog.vue";
import SpecLibrary from "./SpecLibrary.vue";
import { CompleteStatus } from "~/enums";

const specStore = useSpecStore();
const currentPage = computed({
  get: () => specStore.currentUploadedPageIndex,
  set: (val) => {
    specStore.currentUploadedPageIndex = val;
  },
});
const viewingPage = ref(0);
const uploadedPages = computed(() => specStore.uploadedPages);
const CardRef = ref<Record<string, InstanceType<typeof Element>>>({});
const dialogOpened = ref(false);
const libraryDialogOpened = ref(false);
const specLibrary = computed(() => specStore.specLibrary);

function uploadImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg, image/png";
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      libraryDialogOpened.value = false;
      imageUploadUtil(
        ref(specStore.customUploadedPages),
        file,
        () => {
          ConfirmSelection();
        },
        () => {
          openDialog(uploadedPages.value.length - 1);
        }
      );
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
  const currentImage = uploadedPages.value[currentPage.value];
  CardRef.value[currentImage.id].scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}

function openLibraryDialog() {
  libraryDialogOpened.value = true;
}

function setCardRef(
  el: ComponentPublicInstance | Element | null,
  index: string
) {
  if (el) {
    CardRef.value[index] = el as Element;
  }
}

function ConfirmSelection() {
  specStore.uploadedPages = [];
  specStore.clearSpecSelection();
  for (const library of specLibrary.value) {
    if (library.selected) {
      specStore.uploadedPages = specStore.uploadedPages.concat(library.pages);
      console.log(specStore.uploadedPages);
    }
  }
  specStore.uploadedPages = specStore.uploadedPages.concat(
    specStore.customUploadedPages
  );
  libraryDialogOpened.value = false;
  nextTick(() => {
    currentPage.value = uploadedPages.value.length - 1;
    updateActiveSlide();
  });
}

onMounted(() => {
  nextTick(() => {
    if (uploadedPages.value.length > 0) {
      currentPage.value = 0;
      updateActiveSlide();
    }
  });
});
</script>

<template>
  <v-row align="center" class="mt-2 mb-2">
    <v-col>
      <h2 class="text-h5 font-weight-bold">Uploaded Pages</h2>
    </v-col>
    <v-col cols="auto">
      <v-btn
        @click="openLibraryDialog"
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
            :ref="(el) => setCardRef(el, page.id)"
            :key="index"
            class="slide"
          >
            <v-card
              @click="openDialog(index)"
              link
              class="uploaded-page"
              :class="{
                'current-page': currentPage === index,
              }"
            >
              <template v-if="page.complete == CompleteStatus.Complete">
                <v-img :src="page.url" height="400px" cover></v-img>
              </template>
              <template v-else-if="page.complete == CompleteStatus.Incomplete">
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
              <template v-else>
                <v-sheet
                  class="d-flex flex-column align-center justify-center"
                  height="400px"
                >
                  <v-icon class="mb-2">mdi-alert-circle</v-icon>
                  <span>UI Generation Failed</span>
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
          <v-card
            class="slide text-center d-flex flex-column align-center justify-center"
            height="350px"
            variant="tonal"
          >
            <v-icon icon="mdi-image-outline" size="large" class="mb-2"></v-icon>
            <div>Upload a page to start...</div>
          </v-card>
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

  <teleport to="body">
    <CDialog v-model:visible="libraryDialogOpened" width="80%" height="75%">
      <template #header>
        <div
          class="d-flex justify-space-between"
          style="width: 100%; align-items: flex-end"
        >
          <div>
            <h2 class="text-h6 ml-4">Spec Library</h2>
            <h2 class="text-h4 font-weight-bold ml-4">
              Select a Library or Upload a Page
            </h2>
          </div>
          <v-btn class="mr-8" @click="ConfirmSelection"> Confirm </v-btn>
        </div>
      </template>
      <v-container class="mt-6 fill-height" fluid style="overflow-y: auto">
        <v-row cols="12" class="fill-height pb-4">
          <v-col v-for="library in specLibrary" :md="4">
            <SpecLibrary :info="library"></SpecLibrary>
          </v-col>
          <v-col :md="4">
            <v-card link height="100%" @click="uploadImage">
              <div
                class="d-flex flex-column align-center justify-center fill-height"
              >
                <v-icon size="large">mdi-upload</v-icon>
                <span class="text-subtitle-1">Upload New Page</span>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
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

.current-page {
  border: solid 6px rgba(var(--v-border-color), 0.2);
}
</style>
