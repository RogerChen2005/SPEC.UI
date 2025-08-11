<template>
  <v-card flat class="d-flex flex-column fill-height" color="transparent">
    <v-tabs v-model="activeTab" bg-color="background" class="flex-grow-0">
      <v-tab value="attributes">Attributes</v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="flex-grow-1" style="overflow-y: auto;">
      <v-window-item value="attributes" class="pa-2">
        <div v-for="item in detailItems" :key="item.switchKey" class="mb-4">
          <div class="d-flex align-center">
            <v-switch
              v-model="switchStates[item.switchKey as keyof typeof switchStates]"
              color="primary"
              hide-details
              class="flex-grow-0 mr-2"
            ></v-switch>
            <span class="font-weight-bold">{{ item.label }}</span>
            <v-spacer></v-spacer>
            <v-icon :icon="item.icon"></v-icon>
          </div>
          <v-textarea
            v-if="selectedComponent"
            :model-value="getFieldValue(selectedComponent, item.componentKey)"
            variant="outlined"
            readonly
            rows="2"
            dense
            class="mt-2"
          ></v-textarea>
          <v-textarea
            v-model="editableSpecData[item.specKey]"
            variant="outlined"
            rows="2"
            dense
            :label="`Edit ${item.label}`"
            class="mb-2"
          ></v-textarea>
        </div>
      </v-window-item>
    </v-window>

    <div class="pa-2 flex-grow-0">
      <v-btn block color="primary" @click="applyChange">Apply</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import axios from '~/helpers/RequestHelper';
import { ref, reactive, computed, watch } from 'vue';
import { useSpecStore } from '~/store/SpecStore';

const specStore = useSpecStore();
const selectedImage = computed(() => specStore.selectedUploadedImage)
const selectedComponent = computed(() => specStore.selectedComponent);


const activeTab = ref('attributes');
const switchStates = reactive({
  function: true,
  info: true,
  style: true,
  position: true,
  layout: true,
});

const editableSpecData = ref<Record<string, any>>({});

watch(
  () => selectedImage.value?.reference,
  (newReference) => {
    if (newReference) {
      // 将 reference 数据填充到 editableSpecData
      editableSpecData.value = {
        '承担的功能': newReference['承担的功能'] || '',
        '承载的信息': newReference['承载的信息'] || '',
        '组件的配色样式': newReference['组件的配色样式'] || '',
        '所处的位置': newReference['所处的位置'] || '',
        '组件内的布局样式': newReference['组件内的布局样式'] || '',
      };
      console.log('Filled editableSpecData from selectedImage.reference:', editableSpecData.value);
    } else {
      // 如果没有 reference，清空 editableSpecData
      editableSpecData.value = {};
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => selectedComponent.value,
  (newComponent) => {
    if (!newComponent) {
      editableSpecData.value = {};
    }
  },
  { immediate: true }
);

const detailItems = [
  { label: 'Function', icon: 'mdi-cog-outline', switchKey: 'function', componentKey: 'Functionality', specKey: '承担的功能' },
  { label: 'Displayed Information', icon: 'mdi-information-outline', switchKey: 'info', componentKey: 'InformationCarried', specKey: '承载的信息' },
  { label: 'Color Style & Layout', icon: 'mdi-palette-outline', switchKey: 'style', componentKey: 'ComponentColorStyle', specKey: '组件的配色样式' },
  { label: 'Position', icon: 'mdi-map-marker-outline', switchKey: 'position', componentKey: 'ComponentPosition', specKey: '所处的位置' },
  { label: 'Layout Style', icon: 'mdi-view-dashboard-outline', switchKey: 'layout', componentKey: 'ComponentLayoutStyle', specKey: '组件内的布局样式' },
];

const getFieldValue = (source: Record<string, any> | null, key: string) => {
  if (!source) return '';
  return source[key] || '';
};

const applyChange = () => {
  const keyMap: Record<string, string> = {
    function: '承担的功能',
    info: '承载的信息',
    style: '组件的配色样式',
    position: '所处的位置',
    layout: '组件内的布局样式',
  };

  let result = "请针对我提供的spec对以下内容进行修改：";

  Object.entries(switchStates).forEach(([key, isEnabled]) => {
    if (isEnabled) {
      const specKey = keyMap[key as keyof typeof keyMap];
      const value = editableSpecData.value[specKey];
      if (value) {
        result += `将${specKey}改为：${value}\\n`;
      }
    }
  });
  console.log(switchStates);
  console.log('✔️ 应用的规格内容：\\n' + result);
  applySpecEdit(result);
};

const applySpecEdit = (text: string) => {

  const payload = {
    spec: selectedComponent.value,
    text: text,
    save_name: "edit_spec_01",
  };
  console.log("start editing spec from detailpane:", JSON.stringify(payload));
  axios.post("/edit_spec", payload).then(response => {
    console.log("Spec edited successfully:", response.data.data.spec);
    
    // 创建新的 GeneratedImage 而不是覆盖原有数据
    const currentPage = specStore.generatedPages[specStore.currentGeneratedPageIndex];
    const newGeneratedImage = {
      spec: { ...currentPage.spec },
      generating: false,
      code: currentPage.code || "",
      render_image: currentPage.render_image || "",
      time: new Date(),
    };
    
    // 更新新页面中的组件
    newGeneratedImage.spec.PageStructure.SectionDivision.forEach(region => {
      const componentIndex = region.ContainedComponents.findIndex(
        comp => comp.ComponentID === response.data.data.spec.ComponentID
      );
      
      if (componentIndex !== -1) {
        region.ContainedComponents[componentIndex] = response.data.data.spec;
      }
    });
    
    specStore.generatedPages.push(newGeneratedImage);
    specStore.currentGeneratedPageIndex = specStore.generatedPages.length - 1;
  }).catch(error => {
    console.error("Error editing spec:", error);
  });
};
</script>

<style scoped>
.fill-height {
  height: 100%;
}
</style>
