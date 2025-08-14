<script lang="ts" setup>
import { computed, ref } from "vue";
import LayerSelect from "~/components/LayerSelect.vue";
import { useSpecStore } from "~/store/SpecStore";
import type { BaseImage, GeneratedImage, SpecType } from "~/types";
import SmoothPicture from "./SmoothPicture.vue";

const props = defineProps({
  pageIndex: {
    type: Number,
    required: true,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

const specStore = useSpecStore();
const uploadedPages = computed(() => specStore.uploadedPages);
const generatedPages = computed(() => specStore.generatedPages);
const currentViewingPage = computed<BaseImage>(() =>
  props.editable
    ? uploadedPages.value[props.pageIndex]
    : generatedPages.value[props.pageIndex]
);
const activeTab = ref("layers");
const pageCompositionReference = computed({
  get: () => specStore.pageCompositionReference,
  set: (val) => {
    specStore.pageCompositionReference = val;
  },
});
const designSpecs = computed(() => specStore.designSpecs);
const designSpecsKeys = computed<SpecType[]>(
  () => Object.keys(designSpecs.value) as SpecType[]
);
</script>

<template>
  <v-container class="ma-0 pa-4" fluid style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="7" class="d-flex align-center justify-center pa-6 ui-reference">
        <SmoothPicture :url="currentViewingPage.url" :max-height="500" :max-width="800"></SmoothPicture>
      </v-col>
      <v-col cols="5" class="overflow-y-auto pl-8" style="height: 100%">
        <div v-if="currentViewingPage.spec">
          <v-tabs v-model="activeTab" class="mb-4">
            <v-tab value="layers">
              <v-icon>mdi-layers</v-icon>
            </v-tab>
            <v-tab value="ui">
              <v-icon>mdi-monitor-dashboard</v-icon>
            </v-tab>
            <template v-if="!editable">
              <v-tab value="reference">
                <v-icon>mdi-book-open-page-variant-outline</v-icon>
              </v-tab>
            </template>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="layers">
              <div class="d-flex align-center justify-between mb-2">
                <h1 class="font-weight-bold text-h5 mb-2">Page Structure</h1>
                <v-spacer></v-spacer>
                <v-btn
                  variant="tonal"
                  @click="pageCompositionReference = props.pageIndex"
                  v-if="editable"
                >
                  <template v-if="pageCompositionReference != props.pageIndex">
                    <v-icon>mdi-plus</v-icon>
                    Apply
                  </template>
                  <template v-else>
                    <v-icon>mdi-check</v-icon>
                    Applied
                  </template>
                </v-btn>
              </div>
              <LayerSelect
                :editable="editable"
                :current-tab="pageIndex"
              ></LayerSelect>
            </v-window-item>

            <v-window-item value="ui">
              <h1 class="font-weight-bold text-h5 mb-2">
                UI Design Specification
              </h1>
              <template v-for="key in designSpecsKeys" :key="key">
                <div class="d-flex align-center justify-between mb-2">
                  <h2 class="font-weight-bold text-h6">
                    {{ designSpecs[key].label }}
                  </h2>
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="tonal"
                    @click="designSpecs[key].value = props.pageIndex"
                    v-if="editable"
                  >
                    <template v-if="designSpecs[key].value != props.pageIndex">
                      <v-icon>mdi-plus</v-icon>
                      Apply
                    </template>
                    <template v-else>
                      <v-icon>mdi-check</v-icon>
                      Applied
                    </template>
                  </v-btn>
                </div>
                <v-textarea
                  v-model="currentViewingPage.spec.UI_Design_Specification[key]"
                  variants="tonal"
                  rows="3"
                  auto-grow
                  class="spec-edit"
                  :readonly="!editable"
                ></v-textarea>
              </template>
            </v-window-item>
            <template v-if="!editable">
              <v-window-item value="reference">
                <h1 class="font-weight-bold text-h5 mb-3">Reference</h1>
                <v-img
                  :src="uploadedPages[(currentViewingPage as GeneratedImage).reference].url"
                  class="rounded-lg"
                ></v-img>
                <v-col class="d-flex align-center justify-center">
                  <v-chip prepend-icon="mdi-image-outline" class="pa-4">
                    {{
                      uploadedPages[
                        (currentViewingPage as GeneratedImage).reference
                      ].name
                    }}
                  </v-chip>
                </v-col>
              </v-window-item>
            </template>
          </v-window>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.ui-reference{
  border-right: solid 1px rgba(var(--v-border-color),0.2);
}
</style>
