import { useNuxtApp } from '#app'
import type { BetterstackLogger } from '../types'

export function useBetterstack(): BetterstackLogger {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$betterstack as BetterstackLogger
}
