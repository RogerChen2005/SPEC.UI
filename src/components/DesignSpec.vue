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
const pageCompositionReference = computed({
  get: () => specStore.pageCompositionReference,
  set: (val) => {
    specStore.pageCompositionReference = val;
  },
});
const warningVisible = ref(false);
const missingLabels = ref<string[]>([]);
const uploadedPages = computed(() => specStore.uploadedPages);
const selectDialogVisible = ref(false);
const selectingType = ref<SpecType | "Structure">("Color_System");

function generate() {
  missingLabels.value = checkMissingSpecs(designSpecs.value, pageCompositionReference.value);
  if (missingLabels.value.length > 0) {
    warningVisible.value = true;
  } else {
    specStore.generateImage();
  }
}

function addSpec(index: SpecType | "Structure") {
  selectingType.value = index;
  selectDialogVisible.value = true;
}

function handleSelection(index: number) {
  if (selectingType.value === "Structure") {
    pageCompositionReference.value = index;
  } else {
    designSpecs.value[selectingType.value].value = index;
  }
  selectDialogVisible.value = false;
}
</script>

<template>
  <v-container fluid class="pa-2">
    <v-sheet class="d-flex align-center ma-0 mt-4">
      <v-icon icon="mdi-folder-multiple-outline" class="mr-2"></v-icon>
      <div class="text-h5 font-weight-bold">My Project</div>
      <v-spacer></v-spacer>
    </v-sheet>
    <div class="mt-4 d-flex align-center">
      <div class="text-h6 font-weight-bold">Page Structure</div>
      <v-spacer></v-spacer>
      <!-- <v-select
        label="Select Page"
        :items="uploadedPages.map((p, i) => ({ name: p.name, index: i }))"
        item-title="name"
        item-value="index"
        v-model="pageCompositionReference"
        variant="plain"
        density="compact"
        hide-details
        style="max-width: 25px"
      ></v-select> -->
      <template v-if="pageCompositionReference < 0">
        <v-btn
          variant="text"
          size="small"
          @click="addSpec('Structure')"
          icon="mdi-plus"
        >
        </v-btn>
      </template>
      <template v-else>
        <v-btn variant="text" @click="addSpec('Structure')" icon="mdi-pencil-outline">
        </v-btn>
        <v-btn
          variant="text"
          @click="pageCompositionReference = -1"
          icon="mdi-delete-outline"
        >
        </v-btn>
      </template>
    </div>
    <template v-if="pageCompositionReference >= 0">
      <LayerDisplay
        :page="uploadedPages[pageCompositionReference]"
      ></LayerDisplay>
    </template>
    <div class="text-h6 font-weight-bold mt-4">Page Specification</div>
    <v-card
      v-for="(item, index) in designSpecs"
      :key="index"
      class="mt-4 rounded-lg"
      :title="item.label"
      variant="tonal"
    >
      <template v-slot:prepend>
        <v-icon :icon="item.icon" class="mr-2"></v-icon>
      </template>
      <template v-slot:append>
        <template v-if="item.value >= 0">
          <v-btn
            variant="text"
            @click="addSpec(index)"
            icon="mdi-pencil-outline"
          >
          </v-btn>
          <v-btn
            variant="text"
            @click="item.value = -1"
            icon="mdi-delete-outline"
          >
          </v-btn>
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
      <template #subtitle v-if="item.value >= 0">
        {{ uploadedPages[item.value].name }}
      </template>
      <v-card-text v-if="item.value >= 0">
        <div class="spec-text">
            <div
            v-html="
              ((text) =>
              text
                ? text.replace(
                  /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g,
                  (match) =>
                  `<span style='display: inline-block; width: 1em; height: 1em; background-color: ${match}; border: 1px solid rgba(var(--v-border-color),0.2); vertical-align: bottom; margin: 3px; border-radius: 2px;'></span>${match}`
                )
                : '')(
              uploadedPages[item.value].spec?.UI_Design_Specification[index]
              )
            "
            ></div>
        </div>
      </v-card-text>
    </v-card>
    <v-btn
      block
      color="primary"
      size="large"
      class="text-none mt-4"
      @click="generate"
    >
      Generate
    </v-btn>
  </v-container>

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
    <CDialog v-model:visible="selectDialogVisible" width="70%" height="80%">
      <template #header>
        <h2 class="text-h4 font-weight-bold ml-4">Spec Select</h2>
        <h2 class="text-h6 ml-4">Referencing {{ selectingType }}</h2>
      </template>
      <SelectSpec :type="selectingType" @selected="handleSelection" />
    </CDialog>
  </Teleport>
</template>

<style scoped>
.spec-text {
  overflow: auto;
  text-overflow: ellipsis;
  max-height: 130px;
}
</style>
