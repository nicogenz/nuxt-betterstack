import {
  defineNuxtModule,
  createResolver, addImports,
} from '@nuxt/kit'

export type { BetterstackLogger, BetterstackPublicRuntimeConfig, BetterstackRuntimeConfig } from './runtime/types'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-betterstack',
    configKey: 'betterstack',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

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
