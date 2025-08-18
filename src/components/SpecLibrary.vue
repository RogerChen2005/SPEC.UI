<script setup lang="ts">
import axios from "axios";
import { v4 } from "uuid";
import { onMounted, ref } from "vue";
import { CompleteStatus } from "~/enums";
import type { LibraryInfo, SPEC, UploadImage } from "~/types";

const props = defineProps<{
  info: LibraryInfo;
}>();

interface RemotePage {
  name: string;
  spec: SPEC;
}
const baseURL = "https://pub-75bfd2be3cac486386193527a5c8220d.r2.dev";
const remotePages = ref<UploadImage[]>([]);
const loading = ref(true);

function handleSelected() {
  if (!loading.value) props.info.selected = !props.info.selected;
}

onMounted(() => {
  if (props.info.pages.length <= 0) {
    axios
      .get<RemotePage[]>(`${baseURL}/${props.info.path}/index.json`)
      .then((res) => {
        remotePages.value = res.data.map((page, index) => {
          const spec = page.spec;
          spec.Page_Composition.Sections.forEach((section) => {
            section.selected = true;
            section.Contained_Components.forEach((component) => {
              component.selected = true;
            });
          });
          return {
            url: `${baseURL}/${props.info.path}/${index}.jpg`,
            spec,
            id: v4(),
            name: page.name,
            complete: CompleteStatus.Complete,
          };
        });

        props.info.pages = remotePages.value;
        loading.value = false;
      })
      .catch((error) => {
        console.error("Failed to load remote pages:", error);
        loading.value = false;
      });
  } else {
    remotePages.value = props.info.pages;
    loading.value = false;
  }
});
</script>

<template>
  <v-card
    :title="info.name"
    :subtitle="info.label"
    link
    @click="handleSelected"
    class="fill-height"
    :class="{
      selected: info.selected,
    }"
  >
    <v-card-text style="height: 100%">
      <div v-if="loading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <div v-else style="position: relative; height: 100%; display: block">
        <v-img
          v-for="(page, index) in remotePages.slice(0, 4)"
          :src="page.url"
          :key="page.id"
          height="calc(95% - 70px)"
          cover
          class="library-image rounded-lg"
          :style="{
            width: '80%',
            left: `calc(${(3 - index) * 8}% + 10px)`,
            opacity: `${1 - (3 - index) * 0.1}`,
            transform: `scale(${1 - (3 - index) * 0.1})`,
            filter: `blur(${(3 - index) * 2}px)`,
          }"
        ></v-img>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.library-image {
  top: 1%;
  left: 0px;
  position: absolute;
}

.selected {
  background-color: rgba(var(--v-theme-on-surface), 0.3);
}
</style>
