<template>
    <div>
        <div class="d-flex align-center my-4">
            <h1 class="text-h5 font-weight-bold">History Versions</h1>
        </div>
        <v-card>
            <v-toolbar density="compact">
                <v-toolbar-title class="text-body-2 font-weight-bold">Current UI</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-plus" variant="text" size="small">Add Mark</v-btn>
            </v-toolbar>
            <v-card-text>
                <v-img src="https://i.imgur.com/C3IjDqe.jpeg" cover height="300px"></v-img>
            </v-card-text>
        </v-card>

        <v-card v-for="version in historyVersions" class="mb-4">
            <v-toolbar density="compact">
                <v-toolbar-title class="text-body-2 font-weight-bold">{{ new Date(version.time).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }) }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn prepend-icon="mdi-plus" variant="text" size="small">Add Mark</v-btn>
                <v-btn prepend-icon="mdi-redo" variant="text" size="small">Revert</v-btn>
            </v-toolbar>
            <v-card-text>
                <v-img :src="version.imageUrl" cover height="250px"></v-img>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useHistoryStore } from '~/store/historyStore';

const history = useHistoryStore();
const historyVersions = history.historyVersions;
</script>