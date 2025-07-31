<template>
    <v-row class="text-center" align="center">
        <v-col>
            <h1 class="text-h4 font-weight-bold my-4 text-left">Welcome to Your Projects</h1>
            <p class="subheading text-left">Here is a collection of your ongoing work. Keep up the great progress!
            </p>
        </v-col>
        <v-col cols="auto">
            <v-btn color="primary" @click="openPage('create')" prepend-icon="mdi-plus">Create Project</v-btn>
        </v-col>
    </v-row>

    <v-row>
        <v-col v-for="project in projects" :key="project.id" cols="12" sm="6" md="4">
            <v-card @click="openProject(project)" class="mx-auto" max-width="400" hover>
                <v-img class="align-end" height="200" :src="project.image" cover>
                    <v-card-title>{{ project.title }}</v-card-title>
                </v-img>

                <v-card-subtitle class="pt-4">
                    {{ project.category }}
                </v-card-subtitle>

                <v-card-text>
                    <div>{{ project.description }}</div>
                </v-card-text>

                <v-card-actions>

                    <v-spacer></v-spacer>

                    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-heart"></v-btn>

                    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-share-variant"></v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface Project {
    id: number;
    title: string;
    category: string;
    description: string;
    image: string;
}

const router = useRouter();
const projects = ref<Project[]>([
    {
        id: 1,
        title: "Project Alpha",
        category: "Web Development",
        description: "A web application for managing tasks and projects.",
        image: "https://i.imgur.com/C3IjDqe.jpeg"
    },
    {
        id: 2,
        title: "Project Beta",
        category: "Mobile App",
        description: "A mobile app for tracking fitness activities.",
        image: "https://i.imgur.com/DeqdIIU.jpeg"
    },
    {
        id: 3,
        title: "Project Gamma",
        category: "Data Science",
        description: "A data analysis project using machine learning techniques.",
        image: "https://i.imgur.com/FEDyQXP.gif"
    }
]);

function openProject(project: Project) {
    router.push('/project');
    console.log(`Opening project: ${project.title}`);
}

function openPage(page: string) {
    router.push(`/${page}`);
}
</script>