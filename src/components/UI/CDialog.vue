<template>
    <div class="cd-mask" v-if="visible_" @click.self="handleClose">
        <div ref="bg" class="cd-bg">
            <div class="cd-header pa-6">
                <slot name="header"></slot>
            </div>
            <div class="cd-content">
                <slot name="default"></slot>
            </div>
            <v-btn class="cd-close" icon="mdi-close" @click="handleClose" variant="plain"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import "@/style/cui.scss"

const props = defineProps<{
    visible: boolean,
    width?: string,
    height?: string
}>()

const emit = defineEmits(['update:visible'])

const visible_ = ref(false);
const bg = ref<HTMLElement | null>(null);

const handleClose = () => {
    emit("update:visible", false);
};

const resize = () => {
    if (bg.value) {
        bg.value.style.width = props.width || "500px";
        bg.value.style.height = props.height || "300px";
    }
};

watch(() => props.visible, (val) => {
    if (val) {
        visible_.value = true;
        nextTick(() => resize());
    } else {
        if (bg.value) bg.value.style.animation = "cui-dialog-disappear .3s ease-in";
        setTimeout(() => { visible_.value = false }, 295);
    }
});

onMounted(() => {
    if (props.visible) nextTick(() => resize());
});
</script>

<style scoped>
.cd-mask {
    z-index: 2025;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    animation: cui-dialog-blur .3s;
}

.cd-bg {
    position: absolute;
    width: 500px;
    height: 300px;
    max-width: 80%;
    border: solid rgba(var(--v-border-color), 0.2) 1px;
    background-color: rgb(var(--v-theme-background));
    border-radius: 8px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    animation: cui-dialog-appear .3s cubic-bezier(0, 0.6, 0.2, 1.0);
}

.cd-content {
    padding: 20px;
    height: calc(100% - 60px);
    overflow: hidden;
}

.cd-close {
    position: absolute;
    right: 0;
    top: 0;
    margin: 15px;
    cursor: pointer;
}

.cd-header {
    height: 60px;
    padding: 10px 20px;
}
</style>