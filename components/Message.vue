<template>
  <div
    v-focus
    :class="{
      'self-end bg-chat-message text-white': isCurrentUser,
      'self-start bg-gray-300 text-black': !isCurrentUser,
    }"
    class="max-w-xs p-3 mb-2 rounded-lg"
  >
    <p>{{ message.message }}</p>
    <small class="text-xs">{{ message.sender }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
const props = defineProps({
  message: {
    type: Object as PropType<ChatMessage>,
    required: true,
  },
  currentUser: {
    type: String,
    required: true,
  },
})

const { message, currentUser } = toRefs(props)
const isCurrentUser = computed(() => message.value.sender === currentUser.value)
</script>
