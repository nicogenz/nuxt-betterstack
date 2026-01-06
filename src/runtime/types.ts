export interface BetterstackLogger {
  /**
   * Log a debug message
   */
  debug: (message: string, context?: Record<string, unknown>) => Promise<void>

  /**
   * Log an info message
   */
  info: (message: string, context?: Record<string, unknown>) => Promise<void>

  /**
   * Log a warning message
   */
  warn: (message: string, context?: Record<string, unknown>) => Promise<void>

  /**
   * Log an error message
   */
  error: (message: string, context?: Record<string, unknown>) => Promise<void>

  /**
   * Flush all pending logs to BetterStack
   */
  flush: () => Promise<void>
}

export interface BetterstackRuntimeConfig {
  /**
   * Your BetterStack source token.
   * Can be set via NUXT_BETTERSTACK_SOURCE_TOKEN environment variable.
   */
  sourceToken?: string

  /**
   * The BetterStack ingesting endpoint.
   * Can be set via NUXT_BETTERSTACK_ENDPOINT environment variable.
   */
  endpoint?: string
}

export interface BetterstackPublicRuntimeConfig {
  /**
   * Your BetterStack source token.
   * Can be set via NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN environment variable.
   */
  sourceToken?: string

  /**
   * The BetterStack ingesting endpoint.
   * Can be set via NUXT_PUBLIC_BETTERSTACK_ENDPOINT environment variable.
   */
  endpoint?: string
}
declare module 'nuxt/schema' {
  interface RuntimeConfig {
    betterstack: Partial<BetterstackRuntimeConfig>
  }

  interface PublicRuntimeConfig {
    betterstack: Partial<BetterstackPublicRuntimeConfig>
  }
}
