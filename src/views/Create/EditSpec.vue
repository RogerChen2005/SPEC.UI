<template>

    <div class="flex-grow-1" style="overflow-y: auto;">
        <!-- <v-card outlined>
          <v-row no-gutters class="fill-height">
            <v-col cols="8">
              <iframe 
              src="http://118.31.58.101:45501" 
              height="1000px" 
              width="700px" 
              style="transform: scale(0.9); transform-origin: 0 0;">
              </iframe>
            </v-col>
          </v-row>
        </v-card> -->
    <v-row class="mt-2 align-center">
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          size="small"
          @click="back"
          class="ml-1"
          title="Previous Page"
        ></v-btn>
        <h2 class="text-h5 font-weight-bold mr-2">Generated Pages</h2>
      </v-col>
      <v-col cols="12" md="8" class="d-flex justify-end">
        <div class="d-flex" style="gap: 8px;">
          <v-btn
            variant="flat"
            class="text-none"
            style="width: 180px;"
            @click="openMarkDialog"
          >
            Mark
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            class="text-none"
            style="width: 180px;"
            @click="applyExport"
          >
            Export
          </v-btn>
        </div>
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

  <teleport to="body">
    <CDialog v-model:visible="markDialogOpened" width="60%" height="20%">
      <template #header>
        <v-row class="align-center">
          <v-col cols="10">
            <h2 class="text-h6 ml-4">Mark Generated Page</h2>
          </v-col>
        </v-row>
        <v-text-field
          v-model="markText"
          label="Mark this page with a name or description"
          variant="outlined"
          rows="3"
          dense
          class="ma-4"
        ></v-text-field>
        <div class="d-flex justify-end ma-4">
          <v-btn color="primary" @click="applyMark">Apply</v-btn>
        </div>
      </template>
    </CDialog>
  </teleport>
    </div>
      <v-sheet color="background" class="pa-3">
        <!-- Image display area -->
        <div v-if="uploadedPages.length > 0" class="image-container pa-1 d-flex" style="overflow-x: auto;">
          <div v-for="img in uploadedPages" :key="img.id" class="image-wrapper mr-2 flex-shrink-0">
            <v-img
              :src="img.url"
              class="rounded-lg cursor-pointer"
              aspect-ratio="1"
              cover
              width="200"
            ></v-img>
            <v-btn
              icon="mdi-close"
              size="x-small"
              class="close-button"
              @click="handleRemoveImage(img.id)"
            ></v-btn>
          </div>
        </div>

        <div class="mb-2">
          <span class="text-subtitle-2 text-medium-emphasis">
            Current: {{ getCurrentSelection() }}
          </span>
        </div>
        <!-- Text input area -->
        <v-textarea
          v-model="textValue"
          label="请输入内容"
          variant="outlined"
          rows="3"
          dense
          class="mt-2"
        ></v-textarea>

        <!-- Action buttons -->
        <div class="d-flex justify-space-between align-center mt-2">
            <v-btn icon="mdi-plus" variant="outlined" @click="uploadImage" color="black">
            </v-btn>
          <v-btn variant="tonal" @click="confirmEditSpec">
            Confirm Edit
          </v-btn>
        </div>
      </v-sheet>
     
</template>

<script setup lang="ts">
import { ref, computed, toRaw, nextTick, onMounted, watch,  type ComponentPublicInstance} from 'vue';
import { useSpecStore } from '~/store/SpecStore';
import { imageUploadUtil } from "~/helpers/ReferenceHelper";
import CDialog from '~/components/UI/CDialog.vue';
import DetailedDialog from '~/components/DetailedDialog.vue';
import axios from '~/helpers/RequestHelper';
import type { SPEC, Component, Section } from '~/types';

const textValue = ref('');
const currentPage = ref(0);
const specStore = useSpecStore();
const uploadedPages = computed(() => specStore.uploadedPages);
const generatedPages = computed(() => specStore.generatedPages);
const markText = ref('');
const markDialogOpened = ref(false);

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
  console.log("Open dialog for page index:", index);
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

onMounted(() => {
  updateActiveSlide();
});

function openMarkDialog() {
  markText.value = generatedPages.value[specStore.currentGeneratedPageIndex].mark || '';
  markDialogOpened.value = true;
}

function applyMark() {
  generatedPages.value[specStore.currentGeneratedPageIndex].mark = markText.value;
  markText.value = '';
  markDialogOpened.value = false;
}

function applyExport() {
  const currentPageData = generatedPages.value[specStore.currentGeneratedPageIndex];
  if (currentPageData) {
    const exportData = {
      spec: toRaw(currentPageData.spec),
      code: currentPageData.code,
      time: currentPageData.time,
      mark: currentPageData.mark || '',
      url: currentPageData.url || '',
    };
    console.log("Exporting data:", exportData);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentPageData.mark ? currentPageData.mark : currentPageData.time ? new Date(currentPageData.time).toLocaleString() : "default"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    console.warn("No current page data available for export.");
  }
}

function handleRemoveImage(id: string) {
  specStore.uploadedPages = specStore.uploadedPages.filter((img: { id: string }) => img.id !== id);
}

// function selectImageSpec(id: string) {

//   // Logic to handle image selection
// }

function getCurrentSelection() {
  if (specStore.selectedComponent) {
    return `Component: ${specStore.selectedComponent.Function || 'Unknown Component'}`;
  }
  
  if (specStore.selectedSection) {
    return `Section: ${specStore.selectedSection.Section_Name}`;
  }
  
  const currentPage = generatedPages.value[specStore.currentGeneratedPageIndex];
  if (currentPage) {
    return currentPage.mark 
      ? `Page: ${currentPage.mark}` 
      : currentPage.time 
        ? `Page: ${new Date(currentPage.time).toLocaleString()}` 
        : 'Untitled Page';
  }
  
  return 'No selection';
}
    

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

function confirmEditSpec()  {
  let index = specStore.currentGeneratedPageIndex;
  let spec = "";
  if(specStore.selectedComponent) {
    spec = JSON.stringify(toRaw(specStore.selectedComponent));
  } else if (specStore.selectedSection) {
    spec = JSON.stringify(toRaw(specStore.selectedSection));
  } else {
    spec = JSON.stringify(toRaw(generatedPages.value[index].spec));
  }

  console.log("Confirming edit spec with data:", spec);
  
  const payload = {
      save_name: "edit_spec_01",
      text: textValue.value,
      spec: spec,
  };
  axios.post("/edit_spec", payload).then(response => {
    console.log("Edit spec response:", response.data);
    let origin_spec = specStore.generatedPages[index].spec;

    if(specStore.selectedComponent) {
      specStore.selectedComponent = response.data.data.spec as Component;
    }
    else if(specStore.selectedSection) {
      specStore.selectedSection = response.data.data.spec as Section;
    } else {
      specStore.generatedPages[index].spec = response.data.data.spec as SPEC;
    } 
    // 创建新的 GeneratedImage 而不是覆盖原有数据
    const newGeneratedImage = {
      spec: generatedPages.value[index].spec as SPEC,
      complete: false,
      code: generatedPages.value[index].code || "",
      url: generatedPages.value[index].url,
      time: new Date(),
    };
    specStore.generatedPages[index].spec = origin_spec;
    specStore.generatedPages.push(newGeneratedImage);
    specStore.currentGeneratedPageIndex = specStore.generatedPages.length - 1;
  }).catch(error => {
    console.error("Error editing spec:", error);
  });
};

function back() {
  specStore.tab = "1";
}
</script>

<style scoped>
.render-panel {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #fff;
  border-right: 1px solid #ddd;
}
.inspector-panel {
  padding: 16px;
  background-color: var(--bg-color-solid);
  overflow-y: auto;
  height: 100%;
}
.fill-height {
    height: 100%;
}
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

.padder {
  cursor: default;
}
</style>