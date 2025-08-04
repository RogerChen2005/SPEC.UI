<template>
    <v-navigation-drawer app permanent width="380" class="pa-4">
        <slot name="sidebar-left"></slot>
    </v-navigation-drawer>
    <v-navigation-drawer location="right" app permanent :width="350">
        <slot name="sidebar-right"></slot>
    </v-navigation-drawer>
    <slot name="content"></slot>
</template>
