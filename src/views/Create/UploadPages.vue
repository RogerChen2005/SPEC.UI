<style scoped>
.uploaded-page:hover {
    background: rgba(var(--v-theme-on-surface), 0.1);
    cursor: grab;
}
.dropable {
    background: rgba(var(--v-theme-on-surface), 0.1);
    border: 1px dashed rgb(var(--v-theme-on-surface)) !important;
}
</style>

<template>
    <v-row>
        <v-col cols="9" class="pa-4">
            <v-row align="center" class="mb-0">
                <v-col>
                    <h2 class="text-h5 font-weight-bold">Uploaded Pages</h2>
                </v-col>
                <v-col cols="auto">
                    <v-btn @click="uploadImage" color="primary" width="150" variant="flat" class="text-none">Add</v-btn>
                </v-col>
            </v-row>

            <v-card variant="elevated" class="pa-4 mb-4" border>
                <!-- <v-radio-group v-model="selectedPage">
                    <v-row class="flex-nowrap" style="overflow-x: auto;">
                        <v-col v-for="(page, index) in uploadedPages" :key="index" cols="auto" class="text-center pa-2">
                            <v-radio :value="index" :label="`Image ${index+1}`" class="d-block text-center"></v-radio>
                            <v-img @dragstart="onSelectImage" :src="page" width="200" height="150" cover class="border rounded mt-2"></v-img>
                        </v-col>
                    </v-row>
                </v-radio-group> -->
                <v-row class="flex-nowrap" style="overflow-x: auto;">
                    <v-col v-for="(page, index) in uploadedPages" :key="index" cols="auto"
                        class="text-center pa-2 uploaded-page rounded" @dragstart="()=>onSelectImage(index)" @dragend="onDragEnd"  draggable="true">
                        <v-row no-gutters align="center" class="mb-1" style="width: 200px;">
                            <v-col class="text-left">
                                <span class="text-body-2 font-weight-medium">Image {{ index + 1 }}</span>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn density="compact" icon="mdi-close" variant="text"
                                    @click="uploadedPages.splice(index, 1)"></v-btn>
                            </v-col>
                        </v-row>
                        <v-img draggable="false" :src="page" width="200" height="150" cover class="border rounded mt-2"></v-img>
                    </v-col>
                </v-row>
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
                <v-card-subtitle class="text-body-2 mb-4">Drag and drop the uploaded pages</v-card-subtitle>

                <v-list variant="text" class="px-2 rounded" style="background: transparent;">
                    <v-list-item v-for="(item, index) in designSpecs" :key="item.label" class="mb-4 border rounded"
                        @dragover.prevent @drop="onDrop(index)" :class="{
                            dropable: isDragging,
                        }">
                        <template v-slot:prepend>
                            <v-icon :icon="item.icon" class="mr-3"></v-icon>
                        </template>
                        <v-list-item-title>{{ item.label }}</v-list-item-title>
                        <template v-slot:append>
                            <v-chip size="small" v-if="item.value >= 0 " variant="tonal">Image {{ item.value + 1 }}</v-chip>
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
import axios from '~/scripts/request'

const isDragging = ref(false);
const selectedPageIndex = ref(0);

const uploadedPages = ref<string[]>([
   'https://via.placeholder.com/200x150.png?text=Image+1'
]);

function uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg, image/png';
    input.onchange = e => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            uploadedPages.value.push(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64Image = (reader.result as string).split(',')[1];
                axios.post('/image_to_spec', {
                    image: base64Image,
                    save_name: file.name
                }).then(response => {
                    if (response.data.success) {
                        console.log('Generated UI Spec:', response.data.data.spec);
                        // TODO: Process the returned spec data
                    }
                }).catch(error => {
                    console.error('Error uploading image:', error);
                });
            };
        }
    };
    input.click();
}

function onSelectImage(index: number) {
    isDragging.value = true;
    selectedPageIndex.value = index;
}

function onDragEnd() {
    isDragging.value = false;
}

function onDrop(index: number) {
    designSpecs.value[index].value = selectedPageIndex.value;
}

// 右侧设计规范列表的数据
const designSpecs = ref([
    { icon: 'mdi-palette-outline', label: 'Color', value: -1 },
    { icon: 'mdi-information-outline', label: 'Information', value: -1 },
    { icon: 'mdi-layers-outline', label: 'Layout', value: -1 },
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