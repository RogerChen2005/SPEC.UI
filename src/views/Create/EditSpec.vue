<template>
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
        <SelectHistory v-if="currentPage.history"></SelectHistory>
      </div>
    </v-col>
  </v-row>
  <v-container class="pa-0 ma-0" fluid>
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

</template>

<script setup lang="ts">
import { ref, computed, toRaw } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import { useMessageStore } from "~/store/messageStore";
import CDialog from "~/components/UI/CDialog.vue";
import DetailedDialog from "~/components/DetailedDialog.vue";
import axios from "~/helpers/RequestHelper";
import { CompleteStatus } from "~/enums";
import type { SPEC, UploadImage, UIDesignSpecification } from "~/types";
import { defineAsyncComponent } from "vue";
import { v4 } from "uuid";
import SelectHistory from "~/components/SelectHistory.vue";

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
      let id = v4();
      const newImage: UploadImage = {
        id,
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
        complete: CompleteStatus.Incomplete,
      };
      uploadedPages.value.push(newImage);

      const messageStore = useMessageStore();

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = (reader.result as string).split(",")[1];

        messageStore.add("Uploading image for analysis...", "info");

        const payload = {
          image: base64Image,
          spec: ""
        };
        axios.post("/image_reference", payload)
        .then((response) => {
          if(response.data) {
            const imageIndex = uploadedPages.value.findIndex(
              (img) => img.id === id
            );
            uploadedPages.value[imageIndex].attribute = response.data.UI_Design_Specification as UIDesignSpecification;
            uploadedPages.value[imageIndex].complete = CompleteStatus.Complete;
            console.log("Image upload response:", uploadedPages.value[imageIndex].attribute);
            messageStore.add("Image uploaded successfully!", "success");
          } else {
            messageStore.add("Image upload failed: " + "error");
          }
        })
      }
      
      
    }
  };
  input.click();
}

function confirmEditSpec() {
  let index = specStore.currentGeneratedPageIndex;
  let prompt = "";
  if (specStore.selectedComponent) {
    prompt += `用户想要更改的组件为${JSON.stringify(specStore.selectedComponent)}，意图为：`;
  } else if (specStore.selectedSection) {
    prompt += `用户想要更改的组件为${JSON.stringify(specStore.selectedSection)}，意图为：`;
  }

  console.log("Confirming edit spec with prompt:", prompt + textValue.value);

  const payload = {
    save_name: "edit_spec_01",
    text: prompt + textValue.value,
    spec: generatedPages.value[index].spec,
  };

  textValue.value = "";
  axios
    .post("/edit_spec", payload)
    .then((response) => {
      if(response.data.success) {
        console.log("Edit spec response:", response.data);
        if(!currentPage.value.history) {
          currentPage.value.history = [];
        }
        if (currentPage.value.history) {
          const { history, ...rest } = currentPage.value;
          currentPage.value.history.push({ ...rest });
        }
        currentPage.value.spec = response.data.data.spec as SPEC;
        console.log(currentPage.value.spec);
        currentPage.value.code = response.data.data.extracted_code;
        currentPage.value.time = new Date();
      }
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
