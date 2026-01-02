import { Logtail } from '@logtail/browser'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import type { BetterstackRuntimeConfig, BetterstackLogger } from './types'

let logtailInstance: Logtail | null = null

function getLogtail(config: BetterstackRuntimeConfig): Logtail | null {
  if (!config.sourceToken || config.dev) {
    return null
  }

  if (!logtailInstance) {
    logtailInstance = new Logtail(config.sourceToken, {
      endpoint: config.endpoint,
    })
  }

  return logtailInstance
}

function createLogger(config: BetterstackRuntimeConfig): BetterstackLogger {
  const logtail = getLogtail(config)

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
      if (logtail) {
        await logtail.debug(message, context)
      }
    },
    async info(message: string, context?: Record<string, unknown>) {
      logMessage('info', message, context)
      if (logtail) {
        await logtail.info(message, context)
      }
    },
    async warn(message: string, context?: Record<string, unknown>) {
      logMessage('warn', message, context)
      if (logtail) {
        await logtail.warn(message, context)
      }
    },
    async error(message: string, context?: Record<string, unknown>) {
      logMessage('error', message, context)
      if (logtail) {
        await logtail.error(message, context)
      }
    },
    async flush() {
      if (logtail) {
        await logtail.flush()
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

    // Provide logger instance
    nuxtApp.provide('betterstack', logger)

    // Setup error capturing if enabled
    if (config.captureErrors) {
      nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        const errorMessage = error instanceof Error ? error.message : String(error)
        const errorStack = error instanceof Error ? error.stack : undefined

        if (config.dev) {
          // Dev mode: log to console only
          console.error('[betterstack:error] Unhandled Vue error', {
            message: errorMessage,
            stack: errorStack,
            componentInfo: info,
            url: window.location.href,
          })
        }
        else {
          // Production: send to BetterStack
          logger.error('Unhandled Vue error', {
            message: errorMessage,
            stack: errorStack,
            componentInfo: info,
            url: window.location.href,
          })
        }

        // Re-throw to not suppress the error in dev
        console.error(error)
      }

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        const errorMessage = event.reason instanceof Error ? event.reason.message : String(event.reason)
        const errorStack = event.reason instanceof Error ? event.reason.stack : undefined

        if (config.dev) {
          // Dev mode: log to console only
          console.error('[betterstack:error] Unhandled promise rejection', {
            message: errorMessage,
            stack: errorStack,
            url: window.location.href,
          })
        }
        else {
          // Production: send to BetterStack
          logger.error('Unhandled promise rejection', {
            message: errorMessage,
            stack: errorStack,
            url: window.location.href,
          })
        }
      })

      // Handle global errors
      window.addEventListener('error', (event) => {
        if (config.dev) {
          // Dev mode: log to console only
          console.error('[betterstack:error] Unhandled error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            url: window.location.href,
          })
        }
        else {
          // Production: send to BetterStack
          logger.error('Unhandled error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            url: window.location.href,
          })
        }
      })
    }

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
