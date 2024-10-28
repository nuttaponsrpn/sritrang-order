<template>
  <div class="flex flex-col h-screen">
    <div class="flex-1 overflow-y-auto">
      <ChatView :messages="messages" :currentUser="currentUser" />
    </div>
    <ChatInput :sender="currentUser" @send-message="addMessage" />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
  title: 'Sri Trang - Simple Chat Application',
  meta: [{ name: 'description', content: 'Simple chat message' }],
})

const messages = ref<ChatMessage[]>([
  { message: 'Hello!', sender: 'User1' },
  { message: 'Hi there!', sender: 'assistant' },
])
const currentUser = 'User1'

function addMessage(newMessage: ChatMessage) {
  messages.value.push(newMessage)
}
</script>
