<template>
  <v-navigation-drawer location="right" app permanent width="400">
    <v-col cols="auto">
      <v-tabs v-model="mode" color="primary">
        <v-tab value="edit">Edit</v-tab>
        <v-tab value="history">Reference</v-tab>
        <v-tab value="prompt">Prompt</v-tab>
      </v-tabs>
    </v-col>
    <div class="pa-4 pt-0">
      <v-window v-model="mode" class="mt-2">
        <v-window-item value="edit">
          <EditPanel></EditPanel>
        </v-window-item>

        <v-window-item value="history">
          <ReferencePanel></ReferencePanel>
        </v-window-item>

        <v-window-item value="prompt">
          <PromptPanel></PromptPanel>
        </v-window-item>
      </v-window>
    </div>
  </v-navigation-drawer>

  <v-main>
    <v-container>
      <v-row align="center">
        <v-btn @click="backHome" variant="plain" value="home" icon="mdi-home" class="ml-4">
        </v-btn>
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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BuildSpec from '~/components/BuildSpec.vue'
import HistoryVersions from '~/components/HistoryVersions.vue'
import EditPanel from '~/components/RightPanel/EditPanel.vue'
import PromptPanel from '~/components/RightPanel/PromptPanel.vue'
import ReferencePanel from '~/components/RightPanel/ReferencePanel.vue'

const tab = ref('build')
const mode = ref('edit') // 用于切换编辑模式
const router = useRouter()

function backHome() {
  // 跳转到主页的逻辑
  router.push('/')
}
</script>

<style>
/* 针对 solo-filled 变体的背景色进行微调以匹配设计图 */
.v-text-field--variant-solo-filled .v-field__overlay {
  background-color: #e0e0e0;
}
</style>