<template>
    <v-row align="center" class="mb-2">
        <v-col>
            <h2 class="text-h5 font-weight-bold">Composited Specs</h2>
        </v-col>
        <v-col cols="auto" class="d-flex ga-2">
            <v-btn color="primary" variant="flat" class="text-none">Generate</v-btn>
            <v-btn color="primary" variant="outlined" class="text-none">Start Edit</v-btn>
        </v-col>
    </v-row>

    <v-row class="justify-center">
        <v-sheet border rounded class="composition-canvas" width="60%">
            <v-sheet v-for="area in layoutAreas" :key="area.id" border rounded class="dynamic-area pa-3"
                :style="getAreaStyle(area)">
                <div class="font-weight-bold">{{ area.title }}</div>
                <div class="text-caption">{{ area.description }}</div>
            </v-sheet>
        </v-sheet>
    </v-row>

    <div class="mt-8">
        <h3 class="text-h6 font-weight-bold mb-4">Extracted SPECs</h3>
        <v-row width="70%">
            <v-col  v-for="spec in extractedSpecs" :key="spec.id" cols="12" sm="6" md="3">
                <v-sheet flat border rounded class="position-relative pa-3">
                    <div class="check-box-button">
                        <v-checkbox-btn></v-checkbox-btn>
                    </div>
                    <div class="pa-2">
                        <div class="text-caption text-grey">{{ spec.subtitle }}</div>
                        <div class="text-body-1 font-weight-bold">{{ spec.title }}</div>
                    </div>
                </v-sheet>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { LayoutArea } from '~/types';

const layoutAreas = ref<LayoutArea[]>([
    { id: 1, title: 'Area 1', description: 'Short description', x: 5, y: 5, width: 25, height: 60 },
    { id: 2, title: 'Area 2', description: 'Short description', x: 32, y: 5, width: 30, height: 15 },
    { id: 3, title: 'Area 3', description: 'Short description', x: 64, y: 5, width: 30, height: 15 },
    { id: 4, title: 'Area 4', description: 'Short description', x: 32, y: 22, width: 62, height: 43 },
    { id: 5, title: 'Area 5', description: 'Short description', x: 32, y: 67, width: 19.5, height: 28 },
    { id: 6, title: 'Area 6', description: 'Short description', x: 53.5, y: 67, width: 19.5, height: 28 },
    { id: 7, title: 'Area 7', description: 'Short description', x: 75, y: 67, width: 19.5, height: 28 },
]);

const getAreaStyle = (area: LayoutArea) => ({
    top: `${area.y}%`,
    left: `${area.x}%`,
    width: `${area.width}%`,
    height: `${area.height}%`,
});

// 底部提取出的组件网格的数据
const extractedSpecs = ref([
    { id: 1, subtitle: 'Input img 1', title: 'Navigation Bar' },
    { id: 2, subtitle: 'Input img 1', title: 'Selection Card' },
    { id: 3, subtitle: 'Input img 1', title: 'Right Column' },
    { id: 4, subtitle: 'Input img 1', title: 'Left Column' },
    { id: 5, subtitle: 'Input img 1', title: 'Navigation Bar' },
    { id: 6, subtitle: 'Input img 1', title: 'Selection Card' },
    { id: 7, subtitle: 'Input img 1', title: 'Right Column' },
    { id: 8, subtitle: 'Input img 1', title: 'Left Columnn' },
]);
</script>

<style scoped>
.composition-canvas {
    position: relative;
    width: 100%;
    /* 保持一个类似 16:9 的宽高比，并设置一个最小高度 */
    aspect-ratio: 16 / 9;
    min-height: 500px;
}

.dynamic-area {
    position: absolute;
    transition: all 0.3s ease-in-out;
    background-color: rgba(170, 220, 255, 0.218);
    border-color: #43aaff79 !important;
    box-sizing: border-box;
    overflow: hidden;
}

.check-box-button{
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>