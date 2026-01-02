import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { useBetterstack } from '#imports'
import type { BetterstackRuntimeConfig } from './types'

export default defineNuxtPlugin({
  name: 'betterstack-server',
  enforce: 'pre',
  setup(nuxtApp) {
    const config = useRuntimeConfig().public.betterstack as BetterstackRuntimeConfig
    const logger = useBetterstack()

    nuxtApp.provide('betterstack', logger)

    // Flush logs before server closes (only in production mode)
    if (!config.dev) {
      process.on('beforeExit', async () => {
        await logger.flush()
      })

      process.on('SIGTERM', async () => {
        await logger.flush()
        process.exit(0)
      })

      process.on('SIGINT', async () => {
        await logger.flush()
        process.exit(0)
      })
    }
  },
})
