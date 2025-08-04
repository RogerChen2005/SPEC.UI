<style scoped>
.uploaded-page:hover {
  background: rgba(var(--v-theme-on-surface), 0.1);
  cursor: grab;
}

.dropable {
  background: rgba(var(--v-theme-on-surface), 0.1);
  border: 1px dashed rgb(var(--v-theme-on-surface)) !important;
}
</style>

<template>
  <v-navigation-drawer location="right" app permanent :width="350">
    <v-card class="pa-4" height="100%">
      <v-card-title class="font-weight-bold">设计规范</v-card-title>
      <v-card-subtitle class="text-body-2 mb-4"
        >Drag and drop the uploaded pages</v-card-subtitle
      >

      <v-list
        variant="text"
        class="px-2 rounded"
        style="background: transparent"
      >
        <v-list-item
          v-for="(item, index) in designSpecs"
          :key="item.label"
          class="mb-4 border rounded"
          @dragover.prevent
          @drop="onDrop(index)"
          :class="{
            dropable: isDragging,
          }"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" class="mr-3"></v-icon>
          </template>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
          <template v-slot:append>
            <v-chip size="small" v-if="item.value >= 0" variant="tonal"
              >Image {{ item.value + 1 }}</v-chip
            >
          </template>
        </v-list-item>
      </v-list>
      <v-card variant="tonal" rounded="lg" class="pa-6" max-width="400">
        <h2 class="text-h5 font-weight-bold">Type your prompt:</h2>

        <v-text-field
          v-model="promptText"
          variant="underlined"
          placeholder="Tell me what you think.."
          rows="3"
          no-resize
          auto-grow
        ></v-text-field>

        <p class="text-body-2 text-medium-emphasis mt-2 mb-4">
          Use short, relevant keywords. Separate terms with commas if needed.
        </p>

        <v-divider></v-divider>

        <v-btn variant="text" color="primary" class="text-none mt-4 pa-0" disabled>
          Need ideas? Check the tips.
        </v-btn>
      </v-card>

      <v-btn block color="primary" size="large" class="text-none mx-2 mt-8" @click="generateImage">
        Generate
      </v-btn>
    </v-card>
  </v-navigation-drawer>

  <v-row>
    <v-col class="pa-4 pt-2">
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
            v-model="currentPage.uploaded"
            height="400"
            progress="red"
            vertical-arrows="left"
            hide-delimiters
            :show-arrows="false"
            class="rounded uploaded-page"
            @dragstart="() => onSelectImage(currentPage.uploaded)"
            @dragend="onDragEnd"
            draggable="true"
          >
            <v-carousel-item
              v-for="(page, index) in uploadedPages"
              :key="index"
            >
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
                  :key="currentPage.uploaded"
                  rounded="xl"
                  class="pointer-events-auto d-flex align-center justify-center pa-2 pl-4 pr-4"
                >
                  Image {{ currentPage.uploaded + 1 }}
                </v-sheet>
              </v-scroll-x-transition>
              <v-chip
                :text="`${currentPage.uploaded + 1} / ${uploadedPages.length}`"
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
              <v-icon
                icon="mdi-image-outline"
                size="large"
                class="mb-2"
              ></v-icon>
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
            v-model="currentPage.generated"
            height="400"
            vertical-arrows="left"
            hide-delimiters
            :show-arrows="false"
            class="rounded uploaded-page"
          >
            <v-carousel-item
              v-for="(page, index) in generatedPages"
              :key="index"
            >
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
              <v-icon
                icon="mdi-image-outline"
                size="large"
                class="mb-2"
              ></v-icon>
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
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import axios from "~/scripts/request";
import type { SPEC, UploadImage, GeneratedImage, Component, Region, PageComposition } from "~/types/index.d";
import { useSpecStore } from "~/store/SpecStore";
import SmoothPicture from "~/components/SmoothPicture.vue";

const isDragging = ref(false);
const selectedPageIndex = ref(0);
const specStore = useSpecStore();
const currentPage = ref({
  uploaded: 0,
  generated: 0,
});
const promptText = ref("");

const uploadedPages = computed(() => specStore.uploadedPages);
const generatedPages = computed(() => specStore.generatedPages);

function uploadImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg, image/png";
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const imageId = Date.now().toString();
      const newImage: UploadImage = {
        id: imageId,
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
        analysisComplete: false,
      };

      uploadedPages.value.push(newImage);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = (reader.result as string).split(",")[1];
        axios
          .post("/image_to_spec", {
            image: base64Image,
            save_name: file.name,
          })
          .then((response) => {
            if (response.data.success) {
              console.log("Generated UI Spec:", response.data.data.spec);
              const imageIndex = uploadedPages.value.findIndex(
                (img) => img.id === imageId
              );
              if (imageIndex !== -1) {
                const spec = response.data.data.spec as SPEC;
                spec.PageStructure.SectionDivision.forEach((region) => {
                  region.selected = true;
                  region.ContainedComponents.forEach((component) => {
                    component.selected = true;
                  });
                });
                uploadedPages.value[imageIndex].spec = spec;
                uploadedPages.value[imageIndex].analysisComplete = true;
                uploadedPages.value[imageIndex].selected = true;
              }
            }
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      };
    }
  };
  input.click();
}

function filterSelectedComponents(components: Component[]): Component[] {
  return components.filter(component => component.selected === true);
}

function filterSelectedRegions(regions: Region[]): Region[] {
  return regions.filter(region => region.selected === true).map(region => ({
    ...region,
    ContainedComponents: filterSelectedComponents(region.ContainedComponents)
  }));
}

function filterSelectedPageStructure(pageStructure: PageComposition): PageComposition {
  return {
    SectionDivision: filterSelectedRegions(pageStructure.SectionDivision)
  };
}

function generateImage() {
  const spec: Partial<SPEC> = {};

  const missingSpecs = designSpecs.value.filter((s) => s.value === -1);
  if (missingSpecs.length > 0) {
    const missingLabels = missingSpecs.map((s) => s.label).join(", ");
    alert(
      `Please select an image for the following design specs: ${missingLabels}`
    );
    return;
  }

  const generatedPage: GeneratedImage = {
    generating: true,
    code: "",
    render_image: "",
  }

  generatedPages.value.push(generatedPage);

  let index = generatedPages.value.length - 1;

  designSpecs.value.forEach((designSpec) => {
    const page = uploadedPages.value[designSpec.value];
    if (page && page.spec) {
      switch (designSpec.label) {
        case "Color":
          spec.VisualStyle = page.spec.VisualStyle;
          break;
        case "Information":
          spec.UIDescription = page.spec.UIDescription;
          break;
        case "Layout":
          spec.PageStructure = filterSelectedPageStructure(page.spec.PageStructure);
          break;
      }
    }
  });

  axios
    .post("/init_ui_generation", {
      text: promptText.value,
      spec: spec,
    })
    .then((response) => {
      if (response.data.success) {
        console.log("Generated Code:", response.data.data.code);
        console.log("Generated Image:", response.data.data.render_image);
        generatedPages.value[index].code = response.data.data.code;
        generatedPages.value[index].render_image = 'data:image/png;base64,' + response.data.data.render_image;
        generatedPages.value[index].generating = false;
      }
    })
    .catch((error) => {
      console.error("Error generating image:", error);
    });
}

function onSelectImage(index: number) {
  isDragging.value = true;
  selectedPageIndex.value = index;
}

function onDragEnd() {
  isDragging.value = false;
}

function onDrop(index: number) {
  designSpecs.value[index].value = selectedPageIndex.value;
}

function nextPageUploaded() {
  currentPage.value.uploaded = (currentPage.value.uploaded + 1) % uploadedPages.value.length;
}

function prevPageUploaded() {
  currentPage.value.uploaded =
    (currentPage.value.uploaded - 1 + uploadedPages.value.length) %
    uploadedPages.value.length;
}

function nextPageGenerated() {
  currentPage.value.generated = (currentPage.value.generated + 1) % generatedPages.value.length;
}

function prevPageGenerated() {
  currentPage.value.generated =
    (currentPage.value.generated - 1 + generatedPages.value.length) %
    generatedPages.value.length;
}

// 右侧设计规范列表的数据
const designSpecs = ref([
  { icon: "mdi-palette-outline", label: "Color", value: -1 },
  { icon: "mdi-information-outline", label: "Information", value: -1 },
  { icon: "mdi-layers-outline", label: "Layout", value: -1 },
]);
</script>
