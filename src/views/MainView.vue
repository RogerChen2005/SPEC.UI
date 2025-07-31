<template>
  <div id="main-view">
    <v-navigation-drawer v-model="drawer" app permanent width="280" class="pa-4">
      <v-sheet class="d-flex align-center pa-2">
        <v-icon icon="mdi-folder-multiple-outline" class="mr-2"></v-icon>
        <v-list-item-title class="font-weight-bold">My Project</v-list-item-title>
        <v-spacer></v-spacer>
        <v-icon icon="mdi-chevron-down"></v-icon>
      </v-sheet>

      <SpecLayer />

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block variant="text">
            <v-icon left>mdi-plus</v-icon> Add a SPEC level
          </v-btn>
        </div>
      </template>

    </v-navigation-drawer>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SpecLayer from '~/components/SpecLayer.vue';
// import { useMainStore } from "~/store/mainStore";
const drawer = ref(true)

// const store = useMainStore();
</script>

<style>
#main-view {
  width: 100%;
}
</style>
