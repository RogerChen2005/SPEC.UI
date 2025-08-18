<script lang="ts" setup>
import { watch, ref, computed } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import type { SpecType } from "~/types";

const props = defineProps<{
  type: SpecType | "Structure";
}>();

const emit = defineEmits<{
  (e: "selected", index: number | number[]): void;
}>();

const specStore = useSpecStore();

const uploadedPages = computed(() => specStore.uploadedPages);
const designSpecs = computed(() => specStore.designSpecs);

const selectedIndex = computed(() =>
  props.type === "Structure"
    ? specStore.pageCompositionReference
    : specStore.designSpecs[props.type].value
);
const structureIndex = ref<boolean[]>(
  Array(uploadedPages.value.length).fill(false)
);

watch(
  () => uploadedPages.value,
  (newPages) => {
    structureIndex.value = Array(newPages.length).fill(false);
  },
  { immediate: true }
);

function selectImage(index: number) {
  emit("selected", index);
}

function toggleSelectStructure(index: number) {
  if (props.type === "Structure")
    structureIndex.value[index] = !structureIndex.value[index];
}

function confirmStructueSelection() {
  const selected = structureIndex.value
    .map((selected, index) => (selected ? index : -1))
    .filter((index) => index !== -1);
  emit("selected", selected);
  structureIndex.value = [];
}

function useCustomPrompt() {
  if (props.type !== "Structure" && designSpecs.value[props.type].customPrompt)
    selectImage(-1);
}
</script>

<template>
  <v-container class="pa-6 overflow-y-auto mt-6" fluid height="100%">
    <template v-if="props.type !== 'Structure'">
      <h1 class="text-h6 font-weight-bold mb-4">Enter Your Custom Prompt:</h1>
      <v-row class="mb-4">
        <v-col cols="11">
          <v-text-field
            v-model="designSpecs[props.type].customPrompt"
            placeholder="Enter your custom prompt here..."
            variants="tonal"
            clearable
            hide-details
            hide-spin-buttons
            @change="useCustomPrompt"
          ></v-text-field>
        </v-col>
        <v-col cols="1" class="d-flex align-center justify-center">
          <v-btn icon="mdi-check" size="small" @click="useCustomPrompt"></v-btn>
        </v-col>
      </v-row>
    </template>
    <div class="d-flex align-center justify-between mb-4">
      <h1 class="text-h6 font-weight-bold">Select From Reference Image:</h1>
      <v-spacer></v-spacer>
      <v-btn
        v-if="props.type === 'Structure' && uploadedPages.length > 0"
        variant="tonal"
        size="small"
        @click="confirmStructueSelection"
        icon="mdi-check"
      ></v-btn>
    </div>
    <v-row class="d-flex flex-wrap">
      <v-col
        v-for="(page, index) in uploadedPages"
        :key="index"
        cols="12"
        :md="type === 'Structure' ? 4 : 6"
      >
        <v-card
          class="page rounded-lg pa-2 d-flex flex-column"
          :class="{
            'selected-page': selectedIndex === index || structureIndex[index],
          }"
          elevation="2"
          :link="props.type === 'Structure'"
          @click="toggleSelectStructure(index)"
        >
          <template #append>
            <v-btn
              v-if="props.type !== 'Structure'"
              variant="text"
              :icon="
                selectedIndex === index
                  ? 'mdi-check-circle'
                  : 'mdi-check-circle-outline'
              "
              size="36"
              @click="selectImage(index)"
            ></v-btn>
            <v-icon v-else-if="structureIndex[index]">
              mdi-check-circle
            </v-icon>
          </template>
          <template #title>
            <div class="text-h5 font-weight-bold">
              {{ page.name }}
            </div>
          </template>
          <v-card-text>
            <v-row class="flex-grow-1">
              <v-col :cols="type === 'Structure' ? 12 : 6">
                <v-img
                  :src="page.url"
                  height="230px"
                  cover
                  class="rounded-lg"
                ></v-img>
              </v-col>
              <v-col
                cols="6"
                class="spec-text pa-0 pt-2"
                v-if="type !== 'Structure'"
              >
                <v-textarea
                  v-if="page.spec"
                  v-model="page.spec.UI_Design_Specification[type]"
                  hide-details
                  rows="9"
                  density="compact"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.page {
  height: fit-content;
  position: relative;
  height: 310px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
}

/* .page:hover {
  transform: scale(1.02);
} */

.selected-page {
  background-color: rgba(var(--v-theme-primary), 0.3);
}

.spec-text {
  overflow: hidden;
  text-wrap: wrap;
  text-overflow: ellipsis;
  height: calc(100% - 200px);
}
</style>
