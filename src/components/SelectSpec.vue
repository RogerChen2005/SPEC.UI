<script lang="ts" setup>
import { computed } from "vue";
import { useSpecStore } from "~/store/SpecStore";
import type { SpecType } from "~/types";

const props = defineProps<{
  type: SpecType;
}>();

const emit = defineEmits<{
  (e: "selected", index: number): void;
}>();

const specStore = useSpecStore();

const uploadedPages = computed(() => specStore.uploadedPages);

const selectedIndex = computed(() => specStore.designSpecs[props.type].value);

function selectImage(index: number) {
  emit("selected", index);
}
</script>

<template>
  <v-container class="pa-6 overflow-y-auto mt-6" fluid height="100%">
    <v-row class="d-flex flex-wrap justify-space-around">
      <v-col
        v-for="(page, index) in uploadedPages"
        :key="page.id"
        cols="12"
        md="5"
      >
        <v-row @click="selectImage(index)" v-ripple class="page rounded-lg pa-4">
          <v-col cols="6">
            <v-img
              :src="page.url"
              height="300px"
              cover
              class="border-b"
            ></v-img>
          </v-col>
          <v-col cols="6">
            <p class="text-body-2 text-grey-darken-1">
              {{ page.spec?.UI_Design_Specification[props.type] }}
            </p>
          </v-col>
        </v-row>

        <v-fade-transition>
          <v-icon
            v-if="selectedIndex === index"
            color="primary"
            icon="mdi-check-circle"
            size="24"
            style="position: absolute; top: 8px; right: 8px"
          ></v-icon>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.page {
    border: solid 4px rgba(var(--v-border-color), 0.2);
    max-height: 300px;
    overflow: hidden;
    margin-bottom: 1rem;
}
</style>
