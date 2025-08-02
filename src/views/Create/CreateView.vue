<template>
    <v-navigation-drawer app permanent width="380" class="pa-4">
        <v-sheet class="d-flex align-center pa-2">
            <v-icon icon="mdi-folder-multiple-outline" class="mr-2"></v-icon>
            <v-list-item-title class="font-weight-bold">My Project</v-list-item-title>
            <v-spacer></v-spacer>
            <v-icon icon="mdi-chevron-down"></v-icon>
        </v-sheet>

        <LayerSelect></LayerSelect>

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
import UploadPages from './CoarseComp.vue';
// import SpecComposition from './SpecComposition.vue';
import EditSpec from './EditSpec.vue';
import { useRouter } from 'vue-router';
import LayerSelect from '~/components/LayerSelect.vue';

// const currentStep = ref(0);
const tab = ref('coarse');

const router = useRouter();
const backHome = () => {
    router.push("/");
}

</script>

<style>
.v-stepper-header .v-stepper-item__subtitle {
    white-space: normal;
    max-width: 300px;
    text-align: center;
}

.v-checkbox {
    margin-right: 8px;
}
</style>