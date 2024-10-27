<template>
  <div class="flex flex-col h-full p-4 space-y-2 overflow-y-auto">
    <Message v-for="(msg, index) in messages" :key="index" :message="msg" :currentUser="currentUser" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  currentUser: {
    type: String,
    required: true,
  },
  messages: {
    type: Array as PropType<ChatMessage[]>,
    required: true,
  },
})
</script>
