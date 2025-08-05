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
        <template v-if="!page.generating && page.render_image">
            <SmoothPicture :url="page.render_image"></SmoothPicture>
        </template>
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
              @click="selectImageSpec(img.id)"
            ></v-img>
            <v-btn
              icon="mdi-close"
              size="x-small"
              class="close-button"
              @click="handleRemoveImage(img.id)"
            ></v-btn>
          </div>
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
            <v-btn icon="mdi-plus" variant="outlined" @click="handleImageUpload" color="black">
            </v-btn>
          <v-btn variant="tonal" @click="confirmEditSpec">
            Confirm Edit
          </v-btn>
        </div>
      </v-sheet>
     
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue';
import { useSpecStore } from '~/store/SpecStore';
import { imageUploadUtil } from "~/helpers/ReferenceHelper";
import SmoothPicture from '~/components/SmoothPicture.vue';
import axios from '~/helpers/RequestHelper';
import { spec } from 'node:test/reporters';

const textValue = ref('');
const currentPage = ref(0);
const specStore = useSpecStore();
const uploadedPages = computed(() => specStore.uploadedPages);
const generatedPages = computed(() => specStore.generatedPages);
const selectedImage = computed(() => specStore.selectedUploadedImage)
const page = computed(() => generatedPages.value[specStore.currentGeneratedPageIndex]);

function handleRemoveImage(id: string) {
  specStore.uploadedPages = specStore.uploadedPages.filter(img => img.id !== id);
}

function selectImageSpec(id: string) {
  // Logic to handle image selection
  console.log(generatedPages.value);
  specStore.selectedUploadedImage = uploadedPages.value.find(img => img.id === id);
  if (selectedImage.value && selectedImage.value.reference) {
    console.log("selected image attribute: ", selectedImage.value.reference);
  }
}

    

function handleImageUpload() {
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

function confirmEditSpec()  {
  const payload = {
      save_name: "edit_spec_01",
      text: textValue.value,
      spec: toRaw(generatedPages.value[specStore.currentGeneratedPageIndex].spec),
  };
  axios.post("/edit_spec", payload).then(response => {
    console.log("Edit spec response:", response.data);
    specStore.generatedPages[specStore.currentGeneratedPageIndex].spec = response.data.data.spec;
  }).catch(error => {
    console.error("Error editing spec:", error);
  });
};
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
</style>
