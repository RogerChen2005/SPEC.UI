<template>
    <v-row>
        <v-col cols="9" class="pa-4">
            <v-row align="center" class="mb-0">
                <v-col>
                    <h2 class="text-h5 font-weight-bold">Uploaded Pages</h2>
                </v-col>
                <v-col cols="auto">
                    <v-btn color="primary" width="150" variant="flat" class="text-none">Add</v-btn>
                </v-col>
            </v-row>

            <v-card variant="elevated" class="pa-4 mb-4" border>
                <v-radio-group v-model="selectedPage">
                    <v-row class="flex-nowrap" style="overflow-x: auto;">
                        <v-col v-for="i in 5" :key="i" cols="auto">
                            <v-radio :value="`page${i}`" :label="`Input Page ${i}`"></v-radio>
                            <v-img width="600" :src="`https://picsum.photos/300/200?random=${i}`" cover></v-img>
                        </v-col>
                    </v-row>
                </v-radio-group>
            </v-card>

            <div class="mt-6">
                <h3 class="text-subtitle-1 font-weight-bold mb-2">Extracted SPECs - img1</h3>
                <v-row>
                    <v-col v-for="spec in extractedSpecs" :key="spec.id" cols="12" sm="6" md="3">
                        <v-card flat border class="pa-2">
                            <v-checkbox-btn v-model="spec.selected" :label="spec.label"
                                class="font-weight-medium"></v-checkbox-btn>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-col>
        <v-col cols="3" class="mb-4">
            <v-card variant="tonal" class="pa-4" height="100%">
                <v-card-title class="font-weight-bold">设计规范</v-card-title>
                <v-list nav>
                    <v-list-item title="全局设计规范" class="font-weight-bold">
                        <template v-slot:append>
                            <v-icon icon="mdi-chevron-down"></v-icon>
                        </template>
                    </v-list-item>
                </v-list>

                <v-list density="compact" class="px-2">
                    <v-list-item v-for="item in designSpecs" :key="item.label" class="mb-1">
                        <template v-slot:prepend>
                            <v-icon :icon="item.icon" class="mr-3"></v-icon>
                        </template>
                        <v-list-item-title>{{ item.label }}</v-list-item-title>
                        <template v-slot:append>
                            <v-chip size="small" variant="tonal">{{ item.value }}</v-chip>
                        </template>
                    </v-list-item>
                </v-list>

                <v-btn block color="primary" size="large" class="text-none mx-2 mt-8">
                    Generate
                </v-btn>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// const tab = ref('pages');
const selectedPage = ref('page1');

// 右侧设计规范列表的数据
const designSpecs = ref([
    { icon: 'mdi-palette-outline', label: 'Color', value: 'img 3' },
    { icon: 'mdi-information-outline', label: 'Information', value: 'img 9' },
    { icon: 'mdi-layers-outline', label: 'Layout', value: 'img 9' },
]);

// 底部提取出的组件网格的数据
const extractedSpecs = ref([
    { id: 1, label: 'Input img 1 Navigation Bar', selected: true },
    { id: 2, label: 'Input img 1 Selection Card', selected: true },
    { id: 3, label: 'Input img 1 Right Column', selected: true },
    { id: 4, label: 'Input img 1 Left Column', selected: true },
    { id: 5, label: 'Input img 1 Navigation Bar', selected: false },
    { id: 6, label: 'Input img 1 Selection Card', selected: false },
    { id: 7, label: 'Input img 1 Right Column', selected: true },
    { id: 8, label: 'Input img 1 Left Column', selected: true },
]);
</script>