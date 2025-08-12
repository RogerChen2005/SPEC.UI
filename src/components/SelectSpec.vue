<script lang="ts" setup>
import { computed } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import type { SpecType } from "~/types";

const props = defineProps<{
  type: SpecType | "Structure";
}>();

const emit = defineEmits<{
  (e: "selected", index: number): void;
}>();

const specStore = useSpecStore();

const uploadedPages = computed(() => specStore.uploadedPages);

const selectedIndex = computed(() =>
  props.type === "Structure"
    ? specStore.pageCompositionReference
    : specStore.designSpecs[props.type].value
);

function selectImage(index: number) {
  emit("selected", index);
}
</script>

<template>
  <v-container class="pa-6 overflow-y-auto mt-6" fluid height="100%">
    <v-row class="d-flex flex-wrap">
      <v-col
        v-for="(page, index) in uploadedPages"
        :key="page.id"
        cols="12"
        :md="type === 'Structure' ? 4 : 6"
      >
        <v-card
          class="page rounded-lg pa-2 d-flex flex-column"
          :class="{
            'selected-page': selectedIndex === index,
          }"
          v-ripple
          elevation="2"
          @click="selectImage(index)"
        >
          <template #append>
            <v-icon
              v-if="selectedIndex === index"
              color="primary"
              icon="mdi-check-circle"
              size="36"
            ></v-icon>
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
                  height="220px"
                  cover
                  class="border-b"
                ></v-img>
              </v-col>
              <v-col cols="6" class="spec-text" v-if="type !== 'Structure'">
                {{ page.spec?.UI_Design_Specification[type] }}
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
  margin-bottom: 1rem;
  height: fit-content;
  position: relative;
  height: 300px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.page:hover {
  transform: scale(1.02);
}

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
