export default defineNuxtConfig({
  modules: ['../src/module'],

  devtools: { enabled: true },

  // Runtime config (can be overridden by environment variables)
  runtimeConfig: {
    public: {
      betterstack: {
        sourceToken: 'your-source-token', // NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN
        endpoint: 'https://in.logs.betterstack.com', // NUXT_PUBLIC_BETTERSTACK_ENDPOINT
        dev: true, // NUXT_PUBLIC_BETTERSTACK_DEV - Dev mode: logs to console only
      },
    },
  },

  // Module options (build-time only options)
  betterstack: {
    captureErrors: true,
    // Runtime-configurable options can be set here or via runtimeConfig/env vars
    // sourceToken, endpoint, dev are left to runtimeConfig below
  },
})
