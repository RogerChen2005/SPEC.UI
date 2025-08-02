<script setup lang="ts">
import { animate, createSpring } from "animejs";
import { nextTick, onMounted, ref } from "vue";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});
const imgRef = ref<HTMLImageElement | null>(null);

function handleFullSize() {
  const container = document.createElement("div");
  container.style.backgroundImage = `url(${props.url})`;
  container.classList.add("zoomed-picture");
  if (imgRef.value) {
    const rect = imgRef.value.getClientRects()[0];
    const initialWidth = imgRef.value.width || 0;
    const initialHeight = imgRef.value.height || 0;
    const initialTop = rect.top || 0;
    const initialLeft = rect.left || 0;
    container.style.top = `${initialTop}px`;
    container.style.left = `${initialLeft}px`;
    container.style.width = `${initialWidth}px`;
    container.style.height = `${initialHeight}px`;
    document.body.appendChild(container);
    imgRef.value.style.display = "none";
    nextTick(() => {
      const property = {
        top: "0",
        left: "0",
        duration: 500,
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
        ease: createSpring(),
      };
      animate(container, property);
    });

    container.addEventListener("click", () => {
      imgRef.value!.style.display = "inline-block";
      imgRef.value!.style.opacity = "0";
      const rect = imgRef.value!.getClientRects()[0];
      const targetTop = rect.top || 0;
      const targetLeft = rect.left || 0;
      const targetWidth = imgRef.value!.width || 0;
      const targetHeight = imgRef.value!.height || 0;
      const property = {
        top: `${targetTop}px`,
        left: `${targetLeft}px`,
        width: `${targetWidth}px`,
        height: `${targetHeight}px`,
        duration: 500,
        ease: createSpring(),
      };
      animate(container, property).then(() => {
        document.body.removeChild(container);
        imgRef.value!.style.opacity = "1";
      });
    });
  }
}

onMounted(() => {
  if (imgRef.value) {
    imgRef.value.addEventListener("mouseenter", () => {
      imgRef.value!.style.cursor = "zoom-in";
      imgRef.value!.style.transition = "transform 0.3s ease-in-out";
      imgRef.value!.style.transform = "scale(1.05)";
    });
    imgRef.value.addEventListener("mouseleave", () => {
      imgRef.value!.style.cursor = "zoom-in";
      imgRef.value!.style.transition = "transform 0.3s ease-in-out";
      imgRef.value!.style.transform = "scale(1)";
    });
  }
});
</script>

<template>
  <div class="d-flex justify-center align-center smooth-picture-container">
    <img ref="imgRef" :src="url" @click="handleFullSize" class="smooth-picture" />
  </div>
</template>

<style lang="css">
.smooth-picture-container{
  height: 100%;
  width: 100%;
}

.smooth-picture {
  cursor:zoom-in;
  display: inline-block;
  height: 100%;
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
