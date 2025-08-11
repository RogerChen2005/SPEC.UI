<template>
  <CreateLayout>
    <template #sidebar-left>
      <v-window v-model="tab">
        <v-window-item value="1">
          <DesignSpec></DesignSpec>
        </v-window-item>
        <v-window-item value="2">
          <SpecTree></SpecTree>
          <DetailPane> </DetailPane>
        </v-window-item>
      </v-window>
    </template>
    <template #content>
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
          <v-stepper v-model="tab" color="primary">
            <v-stepper-header>
              <v-stepper-item value="1" title="Coarse Comp"></v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item value="2" title="Fine Edit"></v-stepper-item>
            </v-stepper-header>
          </v-stepper>
        </v-col>
      </v-row>

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
import { ref } from "vue";
import UploadPages from "./CoarseComp.vue";
import EditSpec from "./EditSpec.vue";
import { useRouter } from "vue-router";
import DesignSpec from "~/components/DesignSpec.vue";
import CreateLayout from "~/layout/CreateLayout.vue";
import SpecTree from "~/components/SpecTree.vue";
import DetailPane from "~/components/SidePanel/DetailPane.vue";
const tab = ref("1");

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
