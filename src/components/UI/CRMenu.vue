<template>
    <div class="cui-rmenu-mask" @click.self="handleClose" v-if="visible">
        <div ref="bg" class="cui-rmenu-bg">
            <div class="cui-rmenu-content">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineModel, defineExpose } from 'vue';

const dialogVisible = defineModel<boolean>("visible", { default: false });
const bg = ref<HTMLElement | null>(null);

function handleClose() {
    if (bg.value) {
        bg.value.style.animation = "cui-rmenu-disappear .15s ease-in";
        setTimeout(() => dialogVisible.value = false, 150);
    }
}

function handleOpen(x: number, y: number) {
    setTimeout(() => {
        if (bg.value) {
            bg.value.style.top = `${y}px`;
            bg.value.style.left = `${x}px`;
        }
    }, 0);
}

defineExpose({
    handleOpen
});
</script>

<style>
@keyframes cui-rmenu-appear {
    0% {
        opacity: 0%;
        transform: translate(-25%,-25%) scale(0.5);
    }

    100% {
        opacity: 100%;
        transform: scale(1);
    }
}

@keyframes cui-rmenu-disappear {
    0% {
        opacity: 100%;
        transform: scale(1);
    }

    100% {
        opacity: 0%;
        transform: translate(-25%,-25%) scale(0.5);
    }
}

.cui-rmenu-mask {
    z-index: 2007;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.cui-rmenu-bg {
    position: absolute;
    width: auto;
    height: auto;
    max-width: 80%;
    border: solid var(--bd-color) 1px;
    background-color: var(--bg-color-solid);
    border-radius: 8px;
    animation: cui-rmenu-appear .25s cubic-bezier(0, 0, 0.36, 1.29);
}

.cui-rmenu-content {
    height: 100%;
}
</style>