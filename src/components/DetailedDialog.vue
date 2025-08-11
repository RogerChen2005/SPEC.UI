<script lang="ts" setup>
import { computed, ref } from "vue";
import LayerSelect from "~/components/LayerSelect.vue";
import { useSpecStore } from "~/store/SpecStore";

const props = defineProps({
  pageIndex: {
    type: Number,
    required: true,
  },
});

const specStore = useSpecStore();
const uploadedPages = computed(() => specStore.uploadedPages);
const currentViewingPage = computed(() => uploadedPages.value[props.pageIndex]);
const activeTab = ref("layers");
</script>

<template>
  <v-container class="ma-0 pa-4" fluid style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="8" class="d-flex align-center justify-center pa-6">
        <v-card class="rounded-lg"  elevation="5" :image="currentViewingPage.url" style="height: 90%; width: 90%;">
        </v-card>
      </v-col>
      <v-col cols="4" class="overflow-y-auto" style="height: 100%">
        <div v-if="currentViewingPage.spec">
          <!-- UI Description Section -->
          <v-tabs v-model="activeTab" class="mb-4">
            <v-tab value="layers">
              <v-icon>mdi-layers</v-icon>
            </v-tab>
            <v-tab value="ui">
              <v-icon>mdi-monitor-dashboard</v-icon>
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="layers">
              <h1 class="font-weight-bold text-h5 mb-2">Page Structure</h1>
              <LayerSelect :current-tab="pageIndex"></LayerSelect>
            </v-window-item>

            <v-window-item value="ui">
              <h1 class="font-weight-bold text-h5 mb-2">UI Design Specification</h1>
              <v-textarea
                v-model="currentViewingPage.spec.UI_Design_Specification.Color_System"
                label="Color System"
                variants="tonal"
                rows="3"
                auto-grow
                class="mb-2"
              ></v-textarea>
              <v-textarea
                v-model="currentViewingPage.spec.UI_Design_Specification.Layout_Structure"
                label="Layout Structure"
                variants="tonal"
                rows="3"
                auto-grow
                class="mb-2"
              ></v-textarea>
              <v-textarea
                v-model="
                  currentViewingPage.spec.UI_Design_Specification.Shape_Language
                "
                label="Shape Language"
                variants="tonal"
                rows="3"
                auto-grow
                class="mb-2"
              ></v-textarea>
              <v-textarea
                v-model="currentViewingPage.spec.UI_Design_Specification.Usage_Scenario"
                label="Usage Scenario"
                variants="tonal"
                rows="3"
                auto-grow
                class="mb-2"
              ></v-textarea>
            </v-window-item>
          </v-window>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
