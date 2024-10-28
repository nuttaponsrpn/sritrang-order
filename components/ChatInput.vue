<template>
  <div class="flex p-2 bg-white border-t">
    <v-select
      label="Model"
      name="chatModel"
      hide-details
      class="flex-grow-0 mr-2"
      density="compact"
      variant="outlined"
      width="150"
      :items="['ChatGPT', 'Default']"
      :model-value="model"
      @update:model-value="handleModelChange"
    />
    <v-text-field
      hide-details
      v-model.trim="newMessage"
      class="flex-1 mr-2"
      name="chatMessage"
      type="text"
      density="compact"
      placeholder="Type a message..."
      variant="outlined"
      @keyup.enter="sendMessage"
    />
    <v-btn
      elevation="0"
      variant="flat"
      class="!h-full px-4 py-2 rounded-md !text-white"
      :class="isLoading ? '!bg-gray-600 ' : '!bg-chat-message'"
      :disabled="isLoading"
      :loading="isLoading"
      @click="sendMessage"
    >
      Send
    </v-btn>
    <v-snackbar v-model="errorMessage.error" color="error" :timeout="2000" class="text-white">
      {{ errorMessage.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  sender: {
    type: String,
    required: true,
  },
})

// Emits
const emit = defineEmits<{
  'send-message': [value: ChatMessage]
}>()

// Ref
const isLoading = ref(false)
const model = ref<ChatModel>('Default')
const newMessage = ref('')
const errorMessage = reactive({ error: false, message: '' })

onMounted(async () => {
  const messageElem = document.querySelector('input[name="chatMessage"]') as HTMLInputElement
  messageElem.click()
})

function handleModelChange(value: string | null) {
  model.value = (value || 'ChatGPT') as ChatModel
}

async function sendMessage() {
  if (!newMessage.value || isLoading.value) return

  const userMessage = prepareMessage()
  emit('send-message', { sender: props.sender, message: userMessage })

  const selectedChatModel = model.value === 'ChatGPT' ? 'chatgpt' : 'posts'
  const response = await handleAPI(selectedChatModel, userMessage)

  handleResponse(response)
}

function prepareMessage() {
  isLoading.value = true
  const message = newMessage.value
  newMessage.value = ''
  return message
}

async function handleAPI(apiModel: string, message: string) {
  return await fetch(`/api/chat/${apiModel}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sender: props.sender }),
  })
}

async function handleResponse(response: Response) {
  isLoading.value = false
  if (response.status === 204) return

  if (!response.ok) {
    const errMessage = (await response.json()).error
    errorMessage.error = true
    errorMessage.message = errMessage
    return
  }

  const data = (await response.json()) as ChatMessage
  emit('send-message', data)
}
</script>
