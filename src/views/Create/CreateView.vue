<template>
  <CreateLayout>
    <template #sidebar-left>
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
            @click="backHome"
            variant="plain"
            value="home"
            icon="mdi-home"
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
              <v-divider thickness="3" opacity="0.5" class="mx-2 rounded"></v-divider>
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
    </template>
  </CreateLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UploadPages from "./CoarseComp.vue";
import EditSpec from "./EditSpec.vue";
import { useRouter } from "vue-router";
import DesignSpec from "~/components/DesignSpec.vue";
import CreateLayout from "~/layout/CreateLayout.vue";
import SpecTree from "~/components/SpecTree.vue";
import { useSpecStore } from "~/store/specStore";
const specStore = useSpecStore();
const tab = computed(() => specStore.tab);

const router = useRouter();
const backHome = () => {
  router.push("/");
};
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
</style>
