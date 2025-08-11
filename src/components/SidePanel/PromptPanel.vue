<template>
    <div class="d-flex align-center mb-4">
        <span class="text-h6 font-weight-bold">Brand Logo</span>
        <v-spacer></v-spacer>
        <v-icon icon="mdi-chevron-down" class="ml-2"></v-icon>
    </div>
    <v-divider></v-divider>
    <v-card variant="tonal" rounded="lg" class="pa-5">

        <h2 class="text-h6 font-weight-bold mb-3">
            Type your prompt:
        </h2>

        <v-text-field v-model="promptText" variant="underlined" placeholder="Tell me what you think.." rows="3" no-resize
            auto-grow></v-text-field>

        <p class="text-caption text-medium-emphasis mb-4">
            Use short, relevant keywords. Separate terms with commas if needed.
        </p>

        <v-btn block color="primary" size="large" class="text-none mb-3" @click="handleGenerate">
            Generate
        </v-btn>

        <v-divider class="my-4"></v-divider>

        <div class="text-center">
            <a class="text-caption text-primary text-decoration-none">
                Need Ideas? Check the tips.
            </a>
        </div>

    </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 使用 ref 来绑定文本区域的内容
const promptText = ref('');

// "Generate" 按钮的点击事件处理函数
const handleGenerate = () => {
    if (promptText.value) {
        console.log('Generating with prompt:', promptText.value);
        // 在这里添加调用API或其他生成逻辑
    } else {
        console.log('Prompt is empty.');
    }
};
</script>

<style scoped>
/* 确保链接有合适的指针样式 */
a {
    cursor: pointer;
}
</style>