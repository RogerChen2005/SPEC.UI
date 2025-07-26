<template>
  <div id="main-view">
      <v-navigation-drawer v-model="drawer" app permanent width="280" class="pa-4">
        <v-sheet class="d-flex align-center pa-2">
          <v-icon icon="mdi-folder-multiple-outline" class="mr-2"></v-icon>
          <v-list-item-title class="font-weight-bold">My Project</v-list-item-title>
          <v-spacer></v-spacer>
          <v-icon icon="mdi-chevron-down"></v-icon>
        </v-sheet>

        <v-text-field density="compact" variant="solo-filled" flat hide-details prepend-inner-icon="mdi-magnify"
          placeholder="Search for..." class="my-2"></v-text-field>

        <v-list density="compact" nav>
          <v-list-group value="Page1">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-file-document-outline" title="Page 1"></v-list-item>
            </template>
            <v-list-item prepend-icon="mdi-drag-horizontal-variant" title="Top Navigation Bar"></v-list-item>
            <v-list-group value="BrandLogo">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-alpha-b-box-outline" title="Brand Logo"></v-list-item>
              </template>
            </v-list-group>
            <v-list-item prepend-icon="mdi-tab" title="Navigation Tabs"></v-list-item>
            <v-list-item prepend-icon="mdi-gesture-tap-button" title="User Action Area"></v-list-item>
            <v-list-item prepend-icon="mdi-file-tree" title="Network Object Tree"></v-list-item>
            <v-list-item prepend-icon="mdi-application-outline" title="Main Operation Area"></v-list-item>
          </v-list-group>

          <v-list-group value="Page2">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-file-document-outline" title="Page 2"></v-list-item>
            </template>
          </v-list-group>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="grey-lighten-3" variant="text">
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
// import { useMainStore } from "~/store/mainStore";
const drawer = ref(true)

// const store = useMainStore();
</script>

<style>
#main-view {
  width: 100%;
}
</style>
