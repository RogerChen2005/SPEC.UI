<template>
    <!-- <v-row class="pa-4 align-center pb-2 pt-2">
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
        </v-window> -->
    <v-navigation-drawer v-model="drawer" app permanent width="280" class="pa-4">
        <v-sheet class="d-flex align-center pa-2">
            <v-icon icon="mdi-folder-multiple-outline" class="mr-2"></v-icon>
            <v-list-item-title class="font-weight-bold">My Project</v-list-item-title>
            <v-spacer></v-spacer>
            <v-icon icon="mdi-chevron-down"></v-icon>
        </v-sheet>

        <!-- <SpecLayer /> -->

        <template v-slot:append>
            <div class="pa-2">
                <v-btn block variant="text">
                    <v-icon left>mdi-plus</v-icon> Add a SPEC level
                </v-btn>
            </div>
        </template>

    </v-navigation-drawer>

    <v-main>
        <v-container>
            <v-row align="center">
                <v-btn @click="backHome" variant="plain" value="home" icon="mdi-home" class="ml-4">
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

<script setup lang="ts">
import { ref } from 'vue';
import UploadPages from './UploadPages.vue';
// import SpecComposition from './SpecComposition.vue';
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