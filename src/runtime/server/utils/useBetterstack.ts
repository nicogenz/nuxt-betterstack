import { Node as Logtail } from '@logtail/js'
import { useRuntimeConfig } from '#imports'
import type { BetterstackLogger, BetterstackRuntimeConfig } from '../../types'
import defu from 'defu'

function getBetterstack(config?: BetterstackRuntimeConfig): Logtail | null {
  if (!config?.sourceToken || !config?.endpoint) {
    console.debug('Betterstack is not configured properly. Please provide both sourceToken and endpoint. Logs will not be sent.')
    return null
  }

  return new Logtail(config.sourceToken, {
    endpoint: config.endpoint,
  })
}

export function useBetterstack(): BetterstackLogger {
  const config = defu(useRuntimeConfig().betterstack, useRuntimeConfig().public.betterstack)
  const betterstack = getBetterstack(config)

  return {
    async debug(message: string, context?: Record<string, unknown>) {
      if (betterstack) {
        await betterstack.debug(message, context)
      }
    },
    async info(message: string, context?: Record<string, unknown>) {
      if (betterstack) {
        await betterstack.info(message, context)
      }
    },
    async warn(message: string, context?: Record<string, unknown>) {
      if (betterstack) {
        await betterstack.warn(message, context)
      }
    },
    async error(message: string, context?: Record<string, unknown>) {
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
