import { Logtail } from '@logtail/node'
import { useRuntimeConfig } from '#imports'
import type { BetterstackRuntimeConfig, BetterstackLogger } from '../../types'

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

/**
 * Server-side utility to access the BetterStack logger
 * Use this in API routes and server middleware
 */
export function useBetterstack(): BetterstackLogger {
  const config = useRuntimeConfig().public.betterstack as BetterstackRuntimeConfig
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
