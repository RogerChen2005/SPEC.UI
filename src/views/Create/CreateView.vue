<template>
    <v-container fluid>
        <v-row class="pa-4 align-center pb-2 pt-2">
            <v-btn icon="mdi-arrow-left" @click="$router.back()">
            </v-btn>
            <v-stepper editable flat rounded border v-model="currentStep" hide-actions class="ml-4" style="flex-grow: 1;">
                <v-stepper-header>
                    <v-stepper-item title="Uploaded Pages" value="1"></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item title="SPEC Composition" value="2"></v-stepper-item>

                    <v-divider></v-divider>

                    <v-stepper-item title="Edit Spec" value="3"></v-stepper-item>
                </v-stepper-header>
            </v-stepper>
        </v-row>
        <v-window v-model="currentStep" class="mt-4">
            <v-window-item value="1">
                <UploadPages />
            </v-window-item>

            <v-window-item value="2">
                <SpecComposition />
            </v-window-item>

            <v-window-item value="3">
                <EditSpec />
            </v-window-item>
        </v-window>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UploadPages from './UploadPages.vue';
import SpecComposition from './SpecComposition.vue';
import EditSpec from './EditSpec.vue';

// 控制 Stepper 的当前步骤
const currentStep = ref(0);

</script>

<style>
/* 确保 Stepper 头部副标题换行正确 */
.v-stepper-header .v-stepper-item__subtitle {
    white-space: normal;
    max-width: 300px;
    text-align: center;
}

/* 简单模拟一下 Checkbox Card 的样式 */
.v-checkbox {
    margin-right: 8px;
}
</style>