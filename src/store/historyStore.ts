import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHistoryStore = defineStore('history', () => {
  const historyVersions = ref([
    {
        time: 1234567890123,
        imageUrl: 'https://i.imgur.com/C3IjDqe.jpeg'
    },
    {
        time: 1145141919810,
        imageUrl: 'https://i.imgur.com/DeqdIIU.jpeg'
    }
  ]);

  const addHistoryVersion = (version: any) => {
    historyVersions.value.push(version);
  };

  return {
    historyVersions,
    addHistoryVersion  
  };
});