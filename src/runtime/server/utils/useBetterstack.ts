import { Logtail } from '@logtail/node'
import { useRuntimeConfig } from '#imports'
import type { Betterstack, BetterstackRuntimeConfig } from '../../types'
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

export function useBetterstack(): Betterstack {
  const config = defu(useRuntimeConfig().betterstack, useRuntimeConfig().public.betterstack)
  const betterstack = getBetterstack(config)

  return {
    logger: {
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
    },
    heartbeat: {
      success: async (id: string) => {
        await $fetch(`https://uptime.betterstack.com/api/v1/heartbeat/${id}`)
      },
      failure: async (id: string, exitCode?: string) => {
        await $fetch(`https://uptime.betterstack.com/api/v1/heartbeat/${id}/${exitCode ?? 'fail'}`)
      },
    },
  }
}
