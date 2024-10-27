export type ChatGPTResponse = {
  id: string
  object: string
  created: number
  model: string
  choices: Choice[]
  usage: Usage
  system_fingerprint: null
}

type Usage = {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  prompt_tokens_details: Prompttokensdetails
  completion_tokens_details: Completiontokensdetails
}

type Completiontokensdetails = {
  reasoning_tokens: number
}

type Prompttokensdetails = {
  cached_tokens: number
}

type Choice = {
  index: number
  message: Message
  logprobs: null
  finish_reason: string
}

type Message = {
  role: string
  content: string
  refusal: null
}
