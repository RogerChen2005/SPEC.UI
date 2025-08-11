import { defineStore } from "pinia";
import { ref } from "vue";

type MessageTypes = 'error' | 'success' | 'warning' | 'info';

interface Message {
  text: string,
  timeout: number,
  color: MessageTypes,
}

export const useMessageStore = defineStore('messages', () => {
  const queue = ref<Message[]>([])
  
  function add(text: string, color: MessageTypes = 'success', timeout: number = 2000) {
    console.log('Adding message:', { text, color, timeout });
    queue.value.push({
        text,
        color,
        timeout
    })
  }

  return { queue, add }
})