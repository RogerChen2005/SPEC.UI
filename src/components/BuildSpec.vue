<template>
    <div class="d-flex align-center my-4">
        <h1 class="text-h5 font-weight-bold">Build SPEC</h1>
        <v-spacer></v-spacer>
        <v-btn color="primary" size="large" class="text-capitalize">Generate</v-btn>
    </div>

    <v-card>
        <v-toolbar density="compact">
            <v-toolbar-title class="text-body-2 font-weight-bold">Generated UI</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-autorenew" variant="text" size="small"></v-btn>
            <v-btn icon="mdi-fullscreen" variant="text" size="small"></v-btn>
            <v-btn icon="mdi-dots-horizontal" variant="text" size="small"></v-btn>
        </v-toolbar>
        <v-card-text>
            <v-img src="https://i.imgur.com/C3IjDqe.jpeg" cover height="300px"></v-img>
        </v-card-text>
    </v-card>
    
    <h1 class="mt-4 text-h6">SPEC Templates</h1>

    <v-card variant="tonal" class="mt-2">
        <v-card-title class="text-body-1 font-weight-bold"></v-card-title>
        <v-card-text>
            <v-radio-group v-model="specTemplate">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-radio value="page1">
                            <template v-slot:label>
                                <div class="d-flex align-center">
                                    <span class="font-weight-bold">Input Page 1</span>
                                </div>
                            </template>
                        </v-radio>
                        <v-card class="mt-2 ml-8">
                            <v-img src="https://i.imgur.com/DeqdIIU.jpeg" height="250" cover></v-img>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-radio value="page2">
                            <template v-slot:label>
                                <div class="d-flex align-center">
                                    <span class="font-weight-bold">Input Page 2</span>
                                </div>
                            </template>
                        </v-radio>
                        <v-card class="mt-2 ml-8">
                            <v-img src="https://i.imgur.com/FEDyQXP.gif" height="250" cover></v-img>
                        </v-card>
                    </v-col>
                </v-row>
            </v-radio-group>
        </v-card-text>

        <v-card-actions class="pa-8 pt-0">
            <v-spacer></v-spacer>
            <v-btn size="large"  color="primary" variant="elevated" block>Upload</v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const specTemplate = ref('page1') // 默认选中第一个模板
</script>