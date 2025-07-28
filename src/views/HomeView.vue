<template>
    <v-toolbar>
        <h1 class="text-h5 ml-4 mr-4 font-weight-bold">SpecUI</h1>

        <v-btn @click="openPage('/')">Project</v-btn>
        <v-btn @click="openPage('about')">About</v-btn>

        <v-spacer></v-spacer>

        <v-avatar class="mr-2">
            <v-btn icon="mdi-cog" @click="openPage('settings')"></v-btn>
        </v-avatar>
    </v-toolbar>

    <v-container>
        <router-view></router-view>
    </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function openPage(page: string) {
    router.push(`/${page}`);
}
</script>