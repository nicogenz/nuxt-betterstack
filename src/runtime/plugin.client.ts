import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import type { BetterstackRuntimeConfig } from './types'
import { useBetterstack } from '#imports'

export default defineNuxtPlugin({
  name: 'betterstack-client',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig().public.betterstack as BetterstackRuntimeConfig
    const logger = useBetterstack()

    // Flush logs before page unload (only in production mode)
    if (!config.dev) {
      window.addEventListener('beforeunload', () => {
        logger.flush()
      })

      // Also flush on visibility change (for mobile)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          logger.flush()
        }
      })
    }
  },
})
