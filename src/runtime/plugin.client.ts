import { Logtail } from '@logtail/browser'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import type { BetterstackRuntimeConfig, BetterstackLogger } from './types'

let betterstackInstance: Logtail | null = null

function getBetterstack(config: BetterstackRuntimeConfig): Logtail | null {
  if (!config.sourceToken || config.dev) {
    return null
  }

  if (!betterstackInstance) {
    betterstackInstance = new Logtail(config.sourceToken, {
      endpoint: config.endpoint,
    })
  }

  return betterstackInstance
}

function createLogger(config: BetterstackRuntimeConfig): BetterstackLogger {
  const betterstack = getBetterstack(config)

  const logMessage = (level: string, message: string, context?: Record<string, unknown>) => {
    if (config.dev) {
      // Dev mode: log to console only
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
      console[consoleMethod](`[betterstack:${level}]`, message, context || '')
    }
  }

  return {
    async debug(message: string, context?: Record<string, unknown>) {
      logMessage('debug', message, context)
      if (betterstack) {
        await betterstack.debug(message, context)
      }
    },
    async info(message: string, context?: Record<string, unknown>) {
      logMessage('info', message, context)
      if (betterstack) {
        await betterstack.info(message, context)
      }
    },
    async warn(message: string, context?: Record<string, unknown>) {
      logMessage('warn', message, context)
      if (betterstack) {
        await betterstack.warn(message, context)
      }
    },
    async error(message: string, context?: Record<string, unknown>) {
      logMessage('error', message, context)
      if (betterstack) {
        await betterstack.error(message, context)
      }
    },
    async flush() {
      if (betterstack) {
        await betterstack.flush()
      }
    },
  }
}

export default defineNuxtPlugin({
  name: 'betterstack-client',
  enforce: 'pre',
  setup(nuxtApp) {
    const config = useRuntimeConfig().public.betterstack as BetterstackRuntimeConfig
    const logger = createLogger(config)

    nuxtApp.provide('betterstack', logger)

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
