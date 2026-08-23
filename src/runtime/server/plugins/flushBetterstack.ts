import { defineNitroPlugin } from 'nitropack/runtime'
import { flushBetterstack } from '../utils/useBetterstack'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', async () => {
    await flushBetterstack()
  })
})
