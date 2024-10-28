import { mount } from '@vue/test-utils'
import ChatInput from '../components/ChatInput.vue'
import { beforeEach, expect, test, vi } from 'vitest'
import globalEnvironment from './globalEnvironment'

describe('ChatInput.vue', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  test('ChatInput send message successfully', async () => {
    const clickMock = vi.fn()
    vi.spyOn(document, 'querySelector').mockReturnValue({
      click: clickMock,
    })

    const wrapper = mount(ChatInput, {
      ...globalEnvironment,
      props: {
        sender: 'User1',
      },
    })

    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 204,
        ok: true,
        json: () => Promise.resolve({}),
      })
    )
    const input = wrapper.find('input[name="chatMessage"]')
    await input.setValue('Hello world')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('send-message')).toBeTruthy()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('send-message')[0][0]).toEqual({
      message: 'Hello world',
      sender: 'User1',
    })

    expect(clickMock).toHaveBeenCalled()

    const emitted = wrapper.emitted('send-message')
    expect(emitted).toHaveLength(1)
    expect(emitted[0]).toEqual([{ sender: 'User1', message: 'Hello world' }])
  })

  test('ChatInput send message unsuccessfully', async () => {
    const clickMock = vi.fn()
    vi.spyOn(document, 'querySelector').mockReturnValue({
      click: clickMock,
    })

    const wrapper = mount(ChatInput, {
      ...globalEnvironment,
      props: {
        sender: 'User1',
      },
    })

    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 400,
        ok: false,
        json: () => Promise.resolve({ message: 'Bad Request' }),
      })
    )

    const input = wrapper.find('input[name="chatMessage"]')
    await input.setValue('Hello world')
    await wrapper.find('button').trigger('click')

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalled()

    const emitted = wrapper.emitted('send-message')
    expect(emitted).toHaveLength(1)
    expect(emitted[0]).toEqual([{ sender: 'User1', message: 'Hello world' }])
  })

  test('ChatInput send message to ChatGPT unsuccessfully', async () => {
    // Setup
    const clickMock = vi.fn()
    vi.spyOn(document, 'querySelector').mockReturnValue({
      click: clickMock,
    })

    const wrapper = mount(ChatInput, {
      ...globalEnvironment,
      props: {
        sender: 'User1',
      },
    })

    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ message: 'Talking with chatGPT', sender: 'User1' }),
      })
    )

    // Input handle
    const select = wrapper.find('input[name="chatModel"]')
    const input = wrapper.find('input[name="chatMessage"]')
    await input.setValue('Hello world')
    await select.setValue('ChatGPT')
    await wrapper.find('button').trigger('click')

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalled()

    // Expect emit
    const emitted = wrapper.emitted('send-message')
    expect(emitted).toHaveLength(2)
    expect(emitted[0]).toEqual([{ sender: 'User1', message: 'Hello world' }])
    expect(emitted[1]).toEqual([{ message: 'Talking with chatGPT', sender: 'User1' }])
  })
})
