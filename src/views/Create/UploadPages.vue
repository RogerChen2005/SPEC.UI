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
    <!-- <v-navigation-drawer location="right" app permanent :width="500">
        <v-col cols="auto">
            <v-tabs v-model="mode" color="primary">
                <v-tab value="edit">Edit</v-tab>
                <v-tab value="history">Reference</v-tab>
                <v-tab value="prompt">Prompt</v-tab>
            </v-tabs>
        </v-col>
    </v-navigation-drawer> -->
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
                        class="text-center pa-2 uploaded-page rounded" @dragstart="() => onSelectImage(index)"
                        @dragend="onDragEnd" draggable="true">
                        <v-row no-gutters align="center" class="mb-1" style="width: 200px;">
                            <v-col class="text-left">
                                <span class="text-body-2 font-weight-medium">Image {{ index + 1 }}</span>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn density="compact" icon="mdi-close" variant="text"
                                    @click="uploadedPages.splice(index, 1)"></v-btn>
                            </v-col>
                        </v-row>
                        <v-img draggable="false" :src="page.url" width="200" height="150" cover
                            class="border rounded mt-2"></v-img>
                    </v-col>
                </v-row>
            </v-card>

            <div class="mt-6">
                <h3 class="text-subtitle-1 font-weight-bold mb-2">Extracted SPECs</h3>
                <v-tabs v-model="activeTab" bg-color="transparent">
                    <v-tab v-for="(image, index) in uploadedPages" :key="image.id" :value="index">
                        {{ image.name }}
                    </v-tab>
                </v-tabs>

                <v-tabs-window v-model="activeTab" class="mt-4">
                    <v-tabs-window-item v-for="(image, index) in uploadedPages" :key="image.id" :value="index">
                        <v-row v-if="image.spec">
                            <v-col v-for="region in image.spec.页面构成.区域划分" :key="region.区域编号" cols="12" sm="6" md="3">
                                <v-card flat border class="pa-2">
                                    <v-checkbox-btn v-model="region.selected" :label="region.区域名称"
                                        class="font-weight-medium"></v-checkbox-btn>
                                    <v-card-text class="pt-0">
                                        <div class="text-caption text-medium-emphasis">{{ region.所处的位置 }}</div>
                                        <div class="text-caption">{{ region.包含组件.length }} 个组件</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-alert v-else type="info" variant="text">
                            No SPEC data available for this image
                        </v-alert>
                    </v-tabs-window-item>
                </v-tabs-window>
            </div>
        </v-col>
        <!-- <v-col cols="3" class="mb-4">
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
                            <v-chip size="small" v-if="item.value >= 0" variant="tonal">Image {{ item.value + 1
                                }}</v-chip>
                        </template>
                    </v-list-item>
                </v-list>

                <v-btn block color="primary" size="large" class="text-none mx-2 mt-8">
                    Generate
                </v-btn>
            </v-card>
        </v-col> -->
    </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from '~/scripts/request'
import { type SPEC, type UploadImage } from '~/types';

const isDragging = ref(false);
const selectedPageIndex = ref(0);
const activeTab = ref(0);

const uploadedPages = ref<UploadImage[]>([
    {
        id: '1',
        name: 'Sample Image',
        url: 'https://via.placeholder.com/200x150.png?text=Image+1',
        analysisComplete: false,
    }
]);

function uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg, image/png';
    input.onchange = e => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            const imageId = Date.now().toString();
            const newImage: UploadImage = {
                id: imageId,
                name: file.name,
                url: URL.createObjectURL(file),
                file: file,
                analysisComplete: false,
            };

            uploadedPages.value.push(newImage);

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
                        const imageIndex = uploadedPages.value.findIndex(img => img.id === imageId);
                        if (imageIndex !== -1) {
                            uploadedPages.value[imageIndex].spec = response.data.data.spec as SPEC;
                            uploadedPages.value[imageIndex].analysisComplete = true;
                            uploadedPages.value[imageIndex].spec.页面构成.区域划分.forEach(region => {
                                (region as any).selected = true;
                            });
                        }
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
</script>