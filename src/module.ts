import {
  defineNuxtModule,
  addPlugin,
  addImports,
  createResolver,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { BetterstackModuleOptions, BetterstackLogger } from './runtime/types'

export type { BetterstackModuleOptions, BetterstackLogger } from './runtime/types'

declare module '#app' {
  interface NuxtApp {
    $betterstack: BetterstackLogger
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $betterstack: BetterstackLogger
  }
}

export default defineNuxtModule<BetterstackModuleOptions>({
  meta: {
    name: 'nuxt-betterstack',
    configKey: 'betterstack',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    captureErrors: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Runtime configurable options (can be overridden via env vars)
    // Module options take precedence over runtimeConfig
    const runtimeConfigDefaults = {
      sourceToken: '',
      endpoint: 'https://in.logs.betterstack.com',
      dev: false,
    }

    // Non-runtime configurable options (set at build time only)
    const buildTimeConfig = {
      captureErrors: options.captureErrors ?? true,
    }

    // Merge with any existing runtimeConfig (allows env var overrides for unset options)
    // Using defu: first argument wins, so module options > existing runtimeConfig > defaults
    nuxt.options.runtimeConfig.public.betterstack = defu(
      // Module options (highest priority if set)
      {
        ...(options.sourceToken !== undefined ? { sourceToken: options.sourceToken } : {}),
        ...(options.endpoint !== undefined ? { endpoint: options.endpoint } : {}),
        ...(options.dev !== undefined ? { dev: options.dev } : {}),
        ...buildTimeConfig,
      },
      // Existing runtimeConfig (from nuxt.config.ts runtimeConfig section)
      nuxt.options.runtimeConfig.public.betterstack as Record<string, unknown> || {},
      // Defaults (lowest priority)
      {
        ...runtimeConfigDefaults,
        ...buildTimeConfig,
      },
    )

    // Also add to private runtime config for server-side (same logic)
    nuxt.options.runtimeConfig.betterstack = defu(
      {
        ...(options.sourceToken !== undefined ? { sourceToken: options.sourceToken } : {}),
        ...(options.endpoint !== undefined ? { endpoint: options.endpoint } : {}),
        ...(options.dev !== undefined ? { dev: options.dev } : {}),
        ...buildTimeConfig,
      },
      nuxt.options.runtimeConfig.betterstack as Record<string, unknown> || {},
      {
        ...runtimeConfigDefaults,
        ...buildTimeConfig,
      },
    )

    // Validate: warn if sourceToken is not set (checking final merged config)
    const finalConfig = nuxt.options.runtimeConfig.public.betterstack as Record<string, unknown>
    if (!finalConfig.sourceToken && !finalConfig.dev) {
      console.warn('[nuxt-betterstack] sourceToken is required (set via module options, runtimeConfig, or NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN env var)')
    }

    // Add client plugin
    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })

    // Add server plugin
    addPlugin({
      src: resolver.resolve('./runtime/plugin.server'),
      mode: 'server',
    })

    // Add composable auto-import
    addImports({
      name: 'useBetterstack',
      as: 'useBetterstack',
      from: resolver.resolve('./runtime/composables/useBetterstack'),
    })

    // Add server utility
    nuxt.hook('nitro:config', (nitroConfig) => {
      // Add server imports for useBetterstack in server routes
      nitroConfig.imports = nitroConfig.imports || {}
      nitroConfig.imports.imports = nitroConfig.imports.imports || []
      nitroConfig.imports.imports.push({
        name: 'useBetterstack',
        as: 'useBetterstack',
        from: resolver.resolve('./runtime/server/utils/useBetterstack'),
      })
    })
  },
})
