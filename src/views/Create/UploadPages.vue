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
    <v-navigation-drawer location="right" app permanent :width="300">
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
    </v-navigation-drawer>

    <v-row>
        <v-col class="pa-4 pt-2">
            <v-row align="center" class="mt-2 mb-2">
                <v-col>
                    <h2 class="text-h5 font-weight-bold">Uploaded Pages</h2>
                </v-col>
                <v-col cols="auto">
                    <v-btn @click="uploadImage" color="primary" width="150" variant="flat" class="text-none">Add</v-btn>
                </v-col>
            </v-row>

            <!-- <v-carousel v-model="currentIndex" v-if="uploadedPages.length > 0" hide-delimiters direction="vertical"
                height="400" progress="red" vertical-arrows="left" vertical-delimiters="right">
                <v-carousel-item v-for="(page, index) in uploadedPages" :key="index"
                    @dragstart="() => onSelectImage(index)" @dragend="onDragEnd" draggable="true" :src="page.url" cover>
                </v-carousel-item>
                <v-overlay :scrim="false"
                    content-class="w-100 h-100 d-flex flex-column align-center justify-space-between pointer-pass-through py-3"
                    contained model-value no-click-animation persistent>
                    <v-scroll-x-transition mode="out-in" appear>
                        <v-sheet :key="currentIndex" rounded="xl">
                            <v-list-item :title="`Image ${currentIndex + 1}`" class="pa-1 pr-6"></v-list-item>
                        </v-sheet>
                    </v-scroll-x-transition>
                    <v-chip :text="`${currentIndex + 1} / ${uploadedPages.length}`" color="#eee" size="small"
                        variant="flat"></v-chip>
                </v-overlay>
            </v-carousel> -->

            <v-defaults-provider :defaults="{ VBtn: { variant: 'outlined', color: '#eee' } }">
                <v-sheet class="overflow-hidden" max-width="700" rounded="xl">
                    <v-carousel v-model="currentIndex" height="400" progress="red" vertical-arrows="left"
                        hide-delimiter-background>
                        <v-overlay z-index="1" :scrim="false"
                            content-class="w-100 h-100 d-flex flex-column align-center justify-space-between py-3"
                            contained model-value no-click-animation persistent class="pointer-events-none">
                            <v-scroll-x-transition mode="out-in" appear>
                                <v-sheet :key="currentIndex" rounded="xl" class="pointer-events-auto">
                                    <v-list-item :title="`Image ${currentIndex + 1}`" class="pa-1 pr-6"></v-list-item>
                                </v-sheet>
                            </v-scroll-x-transition>
                            <v-chip :text="`${currentIndex + 1} / ${uploadedPages.length}`" color="#eee" size="small"
                                variant="flat" class="pointer-events-auto"></v-chip>
                        </v-overlay>
                        <v-carousel-item v-for="(page, index) in uploadedPages" :key="index"
                            @dragstart="() => onSelectImage(index)" @dragend="onDragEnd" draggable="true"
                            :src="page.url" cover>
                        </v-carousel-item>

                    </v-carousel>
                </v-sheet>
            </v-defaults-provider>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import axios from '~/scripts/request'
import { type SPEC, type UploadImage } from '~/types';
import { useSpecStore } from '~/store/SpecStore';

const isDragging = ref(false);
const selectedPageIndex = ref(0);
const currentIndex = ref(0);
const specStore = useSpecStore();

const uploadedPages = computed(() => specStore.uploadedPages);

const items = ref([
    {
        authorName: 'Bettany Nichols',
        avatarId: 'women/31',
        subtitle: '31k followers',
        src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
    },
    {
        authorName: 'Greg Kovalsky',
        avatarId: 'men/61',
        subtitle: '412 followers',
        src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
    },
    {
        authorName: 'Emma Kathleen',
        avatarId: 'women/34',
        subtitle: '521 followers',
        src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
    },
    {
        authorName: 'Anthony McKenzie',
        avatarId: 'men/78',
        subtitle: '6k followers',
        src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
    },
]);

const currentItem = computed(() => {
    return items.value[currentIndex.value]
});

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
                            const spec = response.data.data.spec as SPEC;
                            spec.页面构成.区域划分.forEach(region => {
                                region.selected = true;
                                region.包含组件.forEach(component => {
                                    component.selected = true;
                                });
                            });
                            uploadedPages.value[imageIndex].spec = spec;
                            uploadedPages.value[imageIndex].analysisComplete = true;
                            uploadedPages.value[imageIndex].selected = true;
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