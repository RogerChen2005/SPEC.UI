<script lang="ts" setup>
import { computed, ref } from "vue";
import { checkMissingSpecs } from "~/helpers/ReferenceHelper";
import { useSpecStore } from "~/store/SpecStore";
import LayerDisplay from "./LayerDisplay.vue";
import CDialog from "./UI/CDialog.vue";
import SelectSpec from "./SelectSpec.vue";
import type { SpecType } from "~/types";

const specStore = useSpecStore();
const designSpecs = computed(() => specStore.designSpecs);
const pageCompositionReference = computed(
  () => specStore.pageCompositionReference
);
const warningVisible = ref(false);
const missingLabels = ref<string[]>([]);
const uploadedPages = computed(() => specStore.uploadedPages);
const selectDialogVisible = ref(false);
const selectingType = ref<SpecType>("Color_System");

function generate() {
  missingLabels.value = checkMissingSpecs(designSpecs.value);
  if (missingLabels.value.length > 0) {
    warningVisible.value = true;
  } else {
    specStore.generateImage();
  }
}

function addSpec(index: SpecType) {
  selectingType.value = index;
  selectDialogVisible.value = true;
}

function handleSelection(index: number) {
  designSpecs.value[selectingType.value].value = index;
  selectDialogVisible.value = false;
}
</script>

<template>
  <v-sheet class="d-flex align-center pa-4 pb-0 pt-6">
    <v-icon icon="mdi-folder-multiple-outline" class="mr-2"></v-icon>
    <v-list-item-title class="font-weight-bold">My Project</v-list-item-title>
    <v-spacer></v-spacer>
  </v-sheet>
  <v-card class="pa-4" height="100%">
    <v-card-title class="font-weight-bold pl-0">设计规范</v-card-title>
    <v-list variant="text" class="px-2 rounded" style="background: transparent">
      <v-list-item
        v-for="(item, index) in designSpecs"
        :key="index"
        class="mb-4 border rounded"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title>{{ item.label }}</v-list-item-title>
        <template v-slot:append>
          <template v-if="item.value >= 0">
            <v-chip
              size="small"
              variant="tonal"
              closable
              @click:close="item.value = -1"
              @click="addSpec(index)"
              link
            >
              Img {{ item.value + 1 }}
            </v-chip>
          </template>
          <template v-else>
            <v-btn
              variant="text"
              size="small"
              @click="addSpec(index)"
              icon="mdi-plus"
            >
            </v-btn>
          </template>
        </template>
      </v-list-item>
    </v-list>
    <template v-if="pageCompositionReference >= 0">
      <h1 class="text-h6 font-weight-bold">Containing Specs</h1>
      <LayerDisplay
        :page="uploadedPages[pageCompositionReference]"
      ></LayerDisplay>
    </template>

    <v-btn
      block
      color="primary"
      size="large"
      class="text-none mt-4"
      @click="generate"
    >
      Generate
    </v-btn>
  </v-card>

  <v-dialog v-model="warningVisible" width="35%">
    <template v-slot:default="{ isActive }">
      <v-card title="Missing Design Specs" class="pa-2">
        <v-card-text>
          Please select an image for the following design specs:
          <ul class="pa-2 pl-8" style="color: rgb(var(--v-theme-error))">
            <li v-for="label in missingLabels" :key="label">{{ label }}</li>
          </ul>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

  <Teleport to="body">
    <CDialog v-model:visible="selectDialogVisible" width="80%" height="80%">
      <template #header>
        <h2 class="text-h4 font-weight-bold ml-4">Spec Select</h2>
        <h2 class="text-h6 ml-4">Referencing {{ selectingType }}</h2>
      </template>
      <SelectSpec :type="selectingType" @selected="handleSelection"/>
    </CDialog>
  </Teleport>
</template>
