import { Browser as Logtail } from '@logtail/js'
import { useRuntimeConfig } from '#app'
import type { BetterstackRuntimeConfig, BetterstackLogger } from '../types'

function getBetterstack(config: BetterstackRuntimeConfig): Logtail | null {
  if (!config.sourceToken || config.dev) {
    return null
  }

  return new Logtail(config.sourceToken, {
    endpoint: config.endpoint,
  })
}

export function useBetterstack(): BetterstackLogger {
  const config = useRuntimeConfig().public.betterstack as BetterstackRuntimeConfig
  const betterstack = getBetterstack(config)

  const logMessage = (level: string, message: string, context?: Record<string, unknown>) => {
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : level === 'debug' ? 'debug' : 'log'
    console[consoleMethod](`[betterstack:${level}]`, message, context || '')
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
