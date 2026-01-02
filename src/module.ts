import {
  defineNuxtModule,
  addPlugin,
  addImports,
  createResolver,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { BetterstackLogger, BetterstackRuntimeConfig } from './runtime/types'

export type { BetterstackLogger, BetterstackRuntimeConfig } from './runtime/types'

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

export default defineNuxtModule({
  meta: {
    name: 'nuxt-betterstack',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const defaults: BetterstackRuntimeConfig = {
      sourceToken: '',
      endpoint: 'https://in.logs.betterstack.com',
      dev: false,
    }

    // Set defaults in runtimeConfig.public.betterstack
    const existingConfig = nuxt.options.runtimeConfig.public.betterstack || {}
    nuxt.options.runtimeConfig.public.betterstack = defu(existingConfig, defaults)

    // Validate: warn if sourceToken is not set
    const config = nuxt.options.runtimeConfig.public.betterstack
    if (!config.sourceToken && !config.dev) {
      console.warn('[nuxt-betterstack] sourceToken is required (set via runtimeConfig.public.betterstack.sourceToken or NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN env var)')
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
