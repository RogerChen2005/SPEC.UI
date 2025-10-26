<template>
  <CreateLayout v-model="sidebarOpen">
    <template #sidebar-left>
      <v-sheet class="d-flex align-center ma-0 mt-4">
        <v-icon icon="mdi-folder-multiple-outline" class="mr-2"></v-icon>
        <div class="text-h5 font-weight-bold">My Project</div>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-chevron-double-left" variant="text" @click="sidebarOpen = false"></v-btn>
      </v-sheet>
      <v-window v-model="tab">
        <v-window-item value="1">
          <DesignSpec></DesignSpec>
        </v-window-item>
        <v-window-item value="2">
          <SpecTree></SpecTree>
        </v-window-item>
      </v-window>
    </template>
    <template #content>
      <v-row align="center">
        <v-col cols="2">
          <v-btn
            @click="openSettings"
            variant="plain"
            value="home"
            icon="mdi-cog"
            class="ml-4"
          >
          </v-btn>
        </v-col>
        <v-col cols="8">
          <v-stepper v-model="tab" style="background-color: transparent" flat>
            <v-stepper-header>
              <v-stepper-item
                value="1"
                title="Coarse Comp"
                color="primary"
              ></v-stepper-item>
              <v-divider
                thickness="3"
                opacity="0.5"
                class="mx-2 rounded"
              ></v-divider>
              <v-stepper-item
                value="2"
                title="Fine Edit"
                color="primary"
              ></v-stepper-item>
            </v-stepper-header>
          </v-stepper>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

      <v-divider></v-divider>

      <v-window v-model="tab">
        <v-window-item value="1">
          <UploadPages />
        </v-window-item>
        <v-window-item value="2">
          <EditSpec />
        </v-window-item>
      </v-window>

      <div v-if="!sidebarOpen" class="open-sidebar-btn" @click="sidebarOpen = true">
        <v-icon>mdi-chevron-double-right</v-icon>
      </div>
    </template>
  </CreateLayout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import UploadPages from "./CoarseComp.vue";
import EditSpec from "./EditSpec.vue";
import { useRouter } from "vue-router";
import DesignSpec from "~/components/DesignSpec.vue";
import CreateLayout from "~/layout/CreateLayout.vue";
import SpecTree from "~/components/SpecTree.vue";
import { useSpecStore } from "~/store/SpecStore";
const specStore = useSpecStore();
const tab = computed(() => specStore.tab);

const router = useRouter();
const openSettings = () => {
  router.push("/settings");
};
const sidebarOpen = ref(true);
</script>

<style>
.v-stepper-header .v-stepper-item__subtitle {
  white-space: normal;
  max-width: 300px;
  text-align: center;
}

.v-checkbox {
  margin-right: 8px;
}

.open-sidebar-btn{
  position: fixed;
  top: 90px;
  left: 0;
  height: 48px;
  border-radius: 0 24px 24px 0;
  transform: translateY(-50%);
  background-color: rgba(var(--v-theme-surface), 0.4);
  border: 1px solid rgba(var(--v-border-color), 0.12);
  backdrop-filter: blur(8px);
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
