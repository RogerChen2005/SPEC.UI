<template>
  <CreateLayout>
    <template #sidebar-left>
      <v-window v-model="tab">
        <v-window-item value="coarse">
          <LayerSelect></LayerSelect>
        </v-window-item>
        <v-window-item value="edit">
          <SpecTree></SpecTree>
        </v-window-item>
      </v-window>
    </template>
    <template #sidebar-right>
      <v-window v-model="tab">
        <v-window-item value="coarse">
          <DesignSpec></DesignSpec>
        </v-window-item>
        <v-window-item value="edit">
          <DetailPane>  </DetailPane>
        </v-window-item>
      </v-window>
    </template>
    <template #content>
      <v-main>
        <v-container>
          <v-row align="center">
            <v-btn
              @click="backHome"
              variant="plain"
              value="home"
              icon="mdi-home"
              class="ml-4"
            >
            </v-btn>
            <v-col>
              <v-tabs v-model="tab" color="primary">
                <v-tab value="coarse">Coarse Comp</v-tab>
                <v-tab value="edit">Fine Edit</v-tab>
              </v-tabs>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <v-window v-model="tab">
            <v-window-item value="coarse">
              <UploadPages />
            </v-window-item>
            <v-window-item value="edit">
              <EditSpec />
            </v-window-item>
          </v-window>
        </v-container>
      </v-main>
    </template>
  </CreateLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UploadPages from "./CoarseComp.vue";
import EditSpec from "./EditSpec.vue";
import { useRouter } from "vue-router";
import LayerSelect from "~/components/LayerSelect.vue";
import DesignSpec from "~/components/DesignSpec.vue";
import CreateLayout from "~/layout/CreateLayout.vue";
import SpecTree from "~/components/SpecTree.vue";
import DetailPane from "~/components/RightPanel/DetailPane.vue";
const tab = ref("coarse");

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
