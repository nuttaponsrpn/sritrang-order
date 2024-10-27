import { sleep } from '~/utils/utils'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    await sleep(1500)
    setResponseStatus(event, 204)
  }
})
