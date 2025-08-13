<script setup lang="ts">
import { animate, createSpring } from "animejs";
import { computed, nextTick, ref } from "vue";
import type { VImg } from "vuetify/components";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});
const imgRef = ref<VImg | null>(null);
const imgContainerRef = ref<InstanceType<typeof VImg> | null>(null);
const imageLoaded = ref(false);
const imageAspectRatio = ref(1);

function handleFullSize() {
  const container = document.createElement("div");
  container.style.backgroundImage = `url(${props.url})`;
  container.classList.add("zoomed-picture", "rounded-lg");
  if (imgContainerRef.value) {
    const el = imgContainerRef.value.$el as HTMLDivElement;
    const rect = el.getClientRects()[0];
    const initialWidth = el.clientWidth || 0;
    const initialHeight = el.clientHeight || 0;
    const initialTop = rect.top || 0;
    const initialLeft = rect.left || 0;
    container.style.top = `${initialTop}px`;
    container.style.left = `${initialLeft}px`;
    container.style.width = `${initialWidth}px`;
    container.style.height = `${initialHeight}px`;
    document.body.appendChild(container);
    nextTick(() => {
      let aspect = window.innerWidth / window.innerHeight;
      let height:number, width:number;
      if (aspect < imageAspectRatio.value){
        width = window.innerWidth - 50;
        height = width / imageAspectRatio.value;
      }
      else {
        height = window.innerHeight - 50;
        width = height * imageAspectRatio.value;
      }
      const property = {
        top: `${(window.innerHeight - height)/2}px`,
        left: `${(window.innerWidth - width)/2}px`,
        duration: 500,
        width: `${width}px`,
        height: `${height}px`,
        ease: createSpring({
          damping: 50,
          stiffness: 600,
          mass: 2
        }),
      };
      animate(container, property).then(() => {
        container.style.transition = "box-shadow 0.3s";
        container.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
      });
    });

    let isZoomed = true;

    container.addEventListener("click", () => {
      if (isZoomed) {
        isZoomed = false;
        el.style.opacity = "0";
        const rect = el.getClientRects()[0];
        const targetTop = rect.top || 0;
        const targetLeft = rect.left || 0;
        const targetWidth = el.clientWidth || 0;
        const targetHeight = el.clientHeight || 0;
        const property = {
          top: `${targetTop}px`,
          left: `${targetLeft}px`,
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
          duration: 500,
          ease: createSpring({
            damping: 40,
            stiffness: 400,
            mass: 2
          }),
        };
        animate(container, property).then(() => {
          el.style.opacity = "1";
          setTimeout(() => {
            document.body.removeChild(container);
          }, 100);
        });
      }
    });
  }
}

const onImageLoad = () => {
  if (imgRef.value) {
    const { naturalWidth, naturalHeight } = imgRef.value;
    if (naturalWidth && naturalHeight) {
      imageAspectRatio.value = naturalWidth / naturalHeight;
      imageLoaded.value = true;
    }
  }
};

const containerStyle = computed(() => {
  if (!imageLoaded.value) return "height: 90%; width: 90%;";

  const maxWidth = 900;
  const maxHeight = 600;

  let width = maxWidth;
  let height = maxWidth / imageAspectRatio.value;

  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * imageAspectRatio.value;
  }

  return `height: ${height}px; width: ${width}px;`;
});
</script>

<template>
  <v-sheet
    class="rounded-lg smooth-picture-container"
    elevation="5"
    :style="containerStyle + ' overflow: hidden;'"
    ref="imgContainerRef"
  >
    <v-img
      :src="url"
      class="smooth-picture"
      cover
      @click="handleFullSize"
      :aspect-ratio="imageAspectRatio"
      ref="imgRef"
      style="border-radius: inherit"
      @load="onImageLoad"
    >
    </v-img>
  </v-sheet>
</template>

<style lang="css">
.smooth-picture-container {
  height: 100%;
  width: 100%;
  transition: 0.1s;
}

.smooth-picture {
  cursor: zoom-in;
}

.zoomed-picture {
  cursor: zoom-out;
  position: fixed;
  z-index: 9999;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
