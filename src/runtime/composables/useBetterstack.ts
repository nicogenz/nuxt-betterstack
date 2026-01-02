import { useNuxtApp } from '#app'
import type { BetterstackLogger } from '../types'

/**
 * Composable to access the BetterStack logger
 * Works in both client and server contexts
 */
export function useBetterstack(): BetterstackLogger {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$betterstack as BetterstackLogger
}
