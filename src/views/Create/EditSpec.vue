<template>
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
    <v-col cols="4" class="d-flex align-center">
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
    <v-col cols="8" class="d-flex justify-end">
      <div class="d-flex" style="gap: 8px">
        <v-btn
          variant="flat"
          class="text-none"
          style="width: 180px"
          @click="openMarkDialog"
        >
          Rename
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          class="text-none"
          style="width: 180px"
          @click="applyExport"
        >
          Export
        </v-btn>
      </div>
    </v-col>
  </v-row>
  <v-container class="pa-0 ma-0" fluid>
    <!-- <v-row align="center">
        <v-col cols="10">
          <div class="slide-content rounded-lg" @click="openDialog(specStore.currentGeneratedPageIndex)">
            <template v-if="currentPage.complete && currentPage.url">
              <img class="slide-image" :src="currentPage.url" />
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
        </v-col>
      </v-row> -->
    <v-row v-if="currentPage.code" class="mt-2">
      <v-col
        cols="10"
        class="d-flex justify-center align-center fill-height"
      >
        <UIPreview
          :code="currentPage.code"
          @spec-click="handleSpecClick"
        ></UIPreview>
      </v-col>
      <v-col cols="2" class="fill-height">
        <h1 class="text-h5 font-weight-bold">Reference</h1>
        <div class="reference-panel mt-2">
          <div
            v-for="(img, index) in uploadedPages"
            :key="index"
            class="mb-2 image-wrapper"
          >
            <v-img
              :src="img.url"
              class="rounded-lg cursor-pointer image-content"
              aspect-ratio="1"
              cover
              width="200"
              @click="openDialog(index)"
              ><div class="image-close-btn">
                <v-btn
                icon="mdi-close"
                size="x-small"
                class="close-button"
                @click.stop="handleRemoveImage(img.id)"
              ></v-btn
            >
              </div></v-img>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-sheet color="background" class="pa-1">
    <!-- Image display area -->

    <div class="input-area">
      <div class="mb-2 input-area-header">
        <span class="text-h6 text-medium-emphasis">
          Current: <strong>{{ getCurrentSelection() }}</strong>
        </span>
      </div>
      <!-- Text input area -->
      <v-textarea
        v-model="textValue"
        placeholder="请输入内容"
        variant="solo"
        flat
        rows="1"
        class="pa-0"
        bg-color="transparent"
        hide-details
        hide-spin-buttons
        auto-grow
      ></v-textarea>

      <!-- Action buttons -->
      <div class="d-flex justify-space-between align-center input-area-actions">
        <v-btn icon="mdi-plus" size="small" variant="tonal" @click="uploadImage"> </v-btn>
        <v-btn variant="tonal" icon="mdi-send" size="small" @click="confirmEditSpec"></v-btn>
      </div>
    </div>
  </v-sheet>

  <teleport to="body">
    <CDialog v-model:visible="dialogOpened" width="80%" height="80%">
      <template #header>
        <h2 class="text-h6 ml-4">Generated Page</h2>
        <h2 class="text-h4 font-weight-bold ml-4">Page Details</h2>
      </template>
      <DetailedDialog
        :editable="true"
        :page-index="viewingPage"
        @close="dialogOpened = false"
      >
      </DetailedDialog>
    </CDialog>
  </teleport>

  <teleport to="body">
    <CDialog v-model:visible="markDialogOpened" width="60%" height="230px">
      <template #header>
        <v-row class="align-center">
          <v-col cols="10">
            <h2 class="text-h6 ml-4">Rename Generated Page</h2>
          </v-col>
        </v-row>
        <v-text-field
          v-model="markText"
          label="Rename this page with a new name or description"
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

  <teleport to="body">
    <CDialog v-model:visible="editDialogOpened" width="80%" height="80%">
      <template #header>
        <v-row class="align-center">
          <v-col cols="10">
            <h2 class="text-h6 ml-4">Edit Message</h2>
          </v-col>
        </v-row>
        <v-textarea>  
          {{ editPath }}
        </v-textarea>
      </template>
    </CDialog>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, toRaw, nextTick } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import { imageUploadUtil } from "~/helpers/ReferenceHelper";
import CDialog from "~/components/UI/CDialog.vue";
import DetailedDialog from "~/components/DetailedDialog.vue";
import axios from "~/helpers/RequestHelper";
// import CodeBar  from '~/components/CodePane.vue';
import type { SPEC, Component, Section } from "~/types";
import { defineAsyncComponent } from "vue";

const UIPreview = defineAsyncComponent(
  () => import("~/components/UIPreview.vue")
);

const textValue = ref("");
const specStore = useSpecStore();
const uploadedPages = computed(() => specStore.uploadedPages);
const generatedPages = computed(() => specStore.generatedPages);
const currentPage = computed(
  () => specStore.generatedPages[specStore.currentGeneratedPageIndex]
);
const markText = ref("");
const markDialogOpened = ref(false);
const editPath = ref("");
const editDialogOpened = ref(false);
const dialogOpened = ref(false);
const viewingPage = ref(0);


function openDialog(index: number) {
  console.log("Open dialog for page index:", index);
  viewingPage.value = index;
  dialogOpened.value = true;
}

function handleSpecClick(value: string | null) {
  if (value) {
  }
}

function openMarkDialog() {
  markText.value =
    generatedPages.value[specStore.currentGeneratedPageIndex].mark || "";
  markDialogOpened.value = true;
}

function applyMark() {
  generatedPages.value[specStore.currentGeneratedPageIndex].mark =
    markText.value;
  markText.value = "";
  markDialogOpened.value = false;
}

function applyExport() {
  const currentPageData =
    generatedPages.value[specStore.currentGeneratedPageIndex];
  if (currentPageData) {
    const exportData = {
      spec: toRaw(currentPageData.spec),
      code: currentPageData.code,
      time: currentPageData.time,
      mark: currentPageData.mark || "",
      url: currentPageData.url || "",
    };
    console.log("Exporting data:", exportData);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${
      currentPageData.mark
        ? currentPageData.mark
        : currentPageData.time
        ? new Date(currentPageData.time).toLocaleString()
        : "default"
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    console.warn("No current page data available for export.");
  }
}

function handleRemoveImage(id: string) {
  specStore.uploadedPages = specStore.uploadedPages.filter(
    (img: { id: string }) => img.id !== id
  );
}

// function selectImageSpec(id: string) {

//   // Logic to handle image selection
// }

function getCurrentSelection() {
  if (specStore.selectedComponent) {
    return `Component: ${
      specStore.selectedComponent.Function || "Unknown Component"
    }`;
  }

  if (specStore.selectedSection) {
    return `Section: ${specStore.selectedSection.Section_Name}`;
  }

  const currentPage = generatedPages.value[specStore.currentGeneratedPageIndex];
  if (currentPage) {
    return "Full Page";
  }

  return "No selection";
}

function uploadImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg, image/png";
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      imageUploadUtil(
        uploadedPages,
        file,
        () => {
          nextTick(() => {});
        },
        () => {}
      );
    }
  };
  input.click();
}

function confirmEditSpec() {
  let index = specStore.currentGeneratedPageIndex;
  let spec: SPEC | Component | Section | undefined = undefined;
  if (specStore.selectedComponent) {
    spec = specStore.selectedComponent;
  } else if (specStore.selectedSection) {
    spec = specStore.selectedSection;
  } else if (generatedPages.value[index].spec){
    spec = generatedPages.value[index].spec;
  }

  console.log("Confirming edit spec with data:", spec);

  const payload = {
    save_name: "edit_spec_01",
    text: textValue.value,
    spec: spec,
  };

  textValue.value = "";
  axios
    .post("/edit_spec", payload)
    .then((response) => {
      console.log("Edit spec response:", response.data);

      if (specStore.selectedComponent) {
        Object.assign(specStore.selectedComponent, response.data.data.spec as Component);
        console.log(specStore.selectedComponent);
      } else if (specStore.selectedSection) {
        Object.assign(specStore.selectedSection, response.data.data.spec as Section);
        console.log("selected section: ",specStore.selectedSection);
      } else {
        specStore.generatedPages[index].spec = response.data.data.spec as SPEC;
        console.log(specStore.generatedPages[index].spec);
      }
      specStore.generatedPages[index].code = response.data.data.extracted_code;
      editDialogOpened.value = true;
      editPath.value = response.data.data.edit_path;
    })
    .catch((error) => {
      console.error("Error editing spec:", error);
    });
}

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

.input-area {
  background-color: rgba(var(--v-theme-on-surface),0.08);
  padding: 10px;
  border-radius: 30px;
  margin-top: 30px;
  position: relative;
}

.input-area-header {
  position: absolute;
  top: -40px;
  left: 50px;
  background-color: rgba(var(--v-theme-on-surface),0.05);
  box-shadow: inset 0 0 5px rgba(var(--v-border-color), 0.1);
  height: 40px;
  padding: 3px 20px 0 20px;
  border-radius: 15px 15px 0 0;
}

.input-area-actions {
  padding: 10px;
  padding-top: 0;
}

.reference-panel {
  max-height: calc(75vh - 30px);
  overflow-y: auto;
}

.image-wrapper{
  gap: 12px;
}

.image-content{
  position: relative;
  border: 5px solid rgba(var(--v-border-color), 0.1);
}

.image-close-btn{
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>
