import { ChatGPTResponse } from '~/types/ChatGPTResponse.type'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userMessage = body.message
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GPT_MODEL,
        messages: [{ role: 'user', content: userMessage }],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      setResponseStatus(event, 400)
      throw new Error(`API request failed with status ${response.status}`)
    }

    setResponseStatus(event, 200)
    const data = (await response.json()) as ChatGPTResponse
    return { message: data.choices[0].message.content, sender: data.choices[0].message.role }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 400)
    return { error: 'Failed to fetch response from ChatGPT' }
  }
})
