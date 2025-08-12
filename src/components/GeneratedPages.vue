<script setup lang="ts">
import {
  ref,
  type ComponentPublicInstance,
  nextTick,
  onMounted,
  computed,
  watch,
} from "vue";
import { useSpecStore } from "~/store/SpecStore";
import CDialog from "./UI/CDialog.vue";
import DetailedDialog from "./DetailedDialog.vue";

const specStore = useSpecStore();
const generatedPages = computed(() => specStore.generatedPages);

const slideRefs = ref<InstanceType<typeof Element>[]>([]);
const activeSlide = computed({
  get: () => specStore.currentGeneratedPageIndex,
  set: (val) => {
    specStore.currentGeneratedPageIndex = val;
  },
});
const dialogOpened = ref(false);
const viewingPage = ref(0);

watch(activeSlide, () => {
  updateActiveSlide();
});

function setSlideRef(el: ComponentPublicInstance | Element | null, index: number) {
  if (el) {
    slideRefs.value[index] = el as Element;
  }
};

function scrollPrev() {
  activeSlide.value =
    (activeSlide.value - 1 + generatedPages.value.length) %
    generatedPages.value.length;
};

function scrollNext() {
  activeSlide.value = (activeSlide.value + 1) % generatedPages.value.length;
};

function updateActiveSlide() {
  nextTick(() => {
    slideRefs.value[activeSlide.value]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  });
}

function openDialog(index: number) {
  viewingPage.value = index;
  if (activeSlide.value !== index) {
    setTimeout(() => {
      dialogOpened.value = true;
    }, 400);
  }
  else dialogOpened.value = true;
  activeSlide.value = index;
  updateActiveSlide();
}

function switchToEdit() {
  specStore.tab = "2";
}
 
onMounted(() => {
  updateActiveSlide();
});
</script>

<template>
  <v-row class="mt-2">
    <v-col>
      <h2 class="text-h5 font-weight-bold">Generated Pages</h2>
    </v-col>
    <v-col cols="auto">
      <v-btn
        color="primary"
        width="150"
        variant="flat"
        class="text-none"
        @click="switchToEdit"
        >Apply</v-btn
      >
    </v-col>
  </v-row>
  <v-container class="pa-0 ma-0" fluid>
    <v-row align="center">
      <v-col cols="1">
        <v-btn
          variant="tonal"
          icon="mdi-arrow-left"
          @click="scrollPrev"
          class="mx-2"
        ></v-btn>
      </v-col>
      <v-col cols="10">
        <div class="generatedPages-wrapper">
          <div class="slide-item  padder"></div>
          <div
            v-for="(page, index) in generatedPages"
            :key="index"
            class="slide-item"
            :class="{
              'active-slide': activeSlide === index,
              'left-slide': activeSlide === index + 1,
              'right-slide': activeSlide === index - 1,
            }"
            :ref="(el) => setSlideRef(el, index)"
            v-ripple="activeSlide === index"
            @click="openDialog(index)"
          >
            <div class="slide-content rounded-lg">
              <template v-if="page.complete && page.url">
                <img class="slide-image" :src="page.url" />
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
            </div>
          </div>
          <div class="slide-item padder"></div>
        </div>
      </v-col>
      <v-col cols="1">
        <v-btn
          variant="tonal"
          icon="mdi-arrow-right"
          @click="scrollNext"
          class="mx-2"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>

  <teleport to="body">
    <CDialog v-model:visible="dialogOpened" width="80%" height="80%">
      <template #header>
        <h2 class="text-h6 ml-4">Generated Page</h2>
        <h2 class="text-h4 font-weight-bold ml-4">Page Details</h2>
      </template>
      <DetailedDialog :editable="false" :page-index="viewingPage" @close="dialogOpened = false">
      </DetailedDialog>
    </CDialog>
  </teleport>
</template>

<style scoped>
.generatedPages-wrapper {
  flex-wrap: nowrap;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 1rem 0;
}

.generatedPages-wrapper::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

.slide-item {
  flex-shrink: 0;
  height: 530px;
  width: 800px;
  margin: 0 16px;
  scroll-snap-align: center;
  filter: blur(4px);
  opacity: 0;
  transition: 0.3s ease-in-out;
  cursor: pointer;
  perspective: 1000px;
}

.slide-item.active-slide {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
  z-index: 100;
}

.slide-item.active-slide:hover {
  transform: scale(1.03);
}

.slide-item.left-slide {
  opacity: 1;
  transform: scale(0.8);
  filter: blur(5px);
}

.slide-item.left-slide:hover{
  transform: scale(0.83);
}

.slide-item.right-slide {
  opacity: 1;
  transform: scale(0.8);
  filter: blur(5px);
}

.slide-item.right-slide:hover{
  transform: scale(0.83);
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  width: 100%;
  height: 100%;
  transition: 0.3s ease-in-out;
  border: solid 4px rgba(var(--v-border-color), 0.2);
  overflow: hidden;
}

.slide-item.left-slide .slide-content {
  transform: translateX(90%) rotateY(10deg);
}

.slide-item.right-slide .slide-content {
  transform: translateX(-90%) rotateY(-10deg);
}

.padder{
  cursor: default;
}
</style>
