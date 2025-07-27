<template>
    <v-text-field density="compact" variant="solo-filled" flat hide-details prepend-inner-icon="mdi-magnify"
        placeholder="Search for..." class="my-2"></v-text-field>

    <v-list density="compact" nav>
        <v-list-group value="Page1">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-file-document-outline" title="Page 1"></v-list-item>
            </template>
            <v-list-item prepend-icon="mdi-drag-horizontal-variant" title="Top Navigation Bar"></v-list-item>
            <v-list-group value="BrandLogo">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-alpha-b-box-outline" title="Brand Logo"></v-list-item>
                </template>
            </v-list-group>
            <v-list-item prepend-icon="mdi-tab" title="Navigation Tabs"></v-list-item>
            <v-list-item prepend-icon="mdi-gesture-tap-button" title="User Action Area"></v-list-item>
            <v-list-item prepend-icon="mdi-file-tree" title="Network Object Tree"></v-list-item>
            <v-list-item prepend-icon="mdi-application-outline" title="Main Operation Area"></v-list-item>
        </v-list-group>

        <v-list-group value="Page2">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-file-document-outline" title="Page 2"></v-list-item>
            </template>
        </v-list-group>
    </v-list>
</template>