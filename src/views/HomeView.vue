<template>
  <v-navigation-drawer location="right" app permanent width="400">
    <v-col cols="auto">
      <v-tabs v-model="mode" color="primary">
        <v-tab value="edit">Edit</v-tab>
        <v-tab value="history">Reference</v-tab>
        <v-tab value="prompt">Prompt</v-tab>
      </v-tabs>
    </v-col>
    <div class="pa-8 pt-2">
      <v-window v-model="mode" class="mt-4">
        <v-window-item value="edit">
          <div class="d-flex align-center mb-4">
            <span class="text-h6 font-weight-bold">Brand Logo</span>
            <v-spacer></v-spacer>
            <v-icon icon="mdi-pencil-outline" class="ml-2"></v-icon>
          </div>

          <v-divider></v-divider>

          <div class="my-4">
            <div class="d-flex align-center text-grey-darken-1 mb-2">
              <span class="font-weight-bold text-body-2">Function</span>
              <v-spacer></v-spacer>
              <v-icon size="small">mdi-function-variant</v-icon>
            </div>
            <p class="text-body-2">Displays product name and brand identity</p>
          </div>
          <v-divider></v-divider>

          <div class="my-4">
            <div class="d-flex align-center text-grey-darken-1 mb-2">
              <span class="font-weight-bold text-body-2">Displayed Information</span>
              <v-spacer></v-spacer>
              <v-icon size="small">mdi-information-outline</v-icon>
            </div>
            <v-sheet border rounded class="pa-3 text-body-2">
              Text logo of 'iMaster NCE'
            </v-sheet>
          </div>
          <v-divider></v-divider>

          <div class="my-4">
            <div class="d-flex align-center text-grey-darken-1 mb-2">
              <span class="font-weight-bold text-body-2">Color Style & Layout</span>
              <v-spacer></v-spacer>
              <v-icon size="small">mdi-palette-outline</v-icon>
            </div>
            <v-sheet border rounded class="pa-3 text-body-2">
              Dark gray text, left-aligned, 24px left margin
            </v-sheet>
          </div>
          <v-divider></v-divider>

          <div class="my-4">
            <div class="d-flex align-center text-grey-darken-1 mb-2">
              <span class="font-weight-bold text-body-2">Position</span>
              <v-spacer></v-spacer>
              <v-icon size="small">mdi-map-marker-outline</v-icon>
            </div>
            <v-sheet border rounded class="pa-3 text-body-2">
              Top left of the page
            </v-sheet>
          </div>
          <v-divider></v-divider>

          <div class="my-4">
            <div class="d-flex align-center text-grey-darken-1 mb-2">
              <span class="font-weight-bold text-body-2">Layout Style</span>
              <v-spacer></v-spacer>
              <v-icon size="small">mdi-view-dashboard-outline</v-icon>
            </div>
            <v-sheet border rounded class="pa-3 text-body-2">
              Horizontally centered
            </v-sheet>
          </div>
        </v-window-item>

        <v-window-item value="history">
          <v-card>
            <v-card-title class="text-h6">History Versions</v-card-title>
            <v-card-text>
              <p>View previous versions of your SPEC.</p>
            </v-card-text>
          </v-card>
        </v-window-item>

        <v-window-item value="prompt">
          <v-card>
            <v-card-title class="text-h6">Prompt</v-card-title>
            <v-card-text>
              <p>Manage your prompts here.</p>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </div>
  </v-navigation-drawer>

  <v-main>
    <v-container>
      <v-row align="center">
        <v-col>
          <v-tabs v-model="tab" color="primary">
            <v-tab value="build">Build SPEC</v-tab>
            <v-tab value="history">History Versions</v-tab>
          </v-tabs>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-window v-model="tab">
        <v-window-item value="build">
          <BuildSpec></BuildSpec>
        </v-window-item>

        <v-window-item value="history">
          <HistoryVersions></HistoryVersions>
        </v-window-item>
      </v-window>

    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import BuildSpec from '~/components/BuildSpec.vue'
import HistoryVersions from '~/components/HistoryVersions.vue'

const tab = ref('build')
const mode = ref('edit') // 用于切换编辑模式
</script>

<style>
/* 针对 solo-filled 变体的背景色进行微调以匹配设计图 */
.v-text-field--variant-solo-filled .v-field__overlay {
  background-color: #e0e0e0;
}
</style>