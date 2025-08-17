<script lang="ts" setup>
const modelValue= defineModel<boolean>();
</script>

<template>
    <v-navigation-drawer v-model="modelValue" app permanent width="380" class="pa-4">
        <slot name="sidebar-left"></slot>
    </v-navigation-drawer>
    <v-main>
        <v-container max-width="100%" class="pa-6 pt-4" style="position: relative;">
            <slot name="content"></slot>
        </v-container>
    </v-main>
</template>
