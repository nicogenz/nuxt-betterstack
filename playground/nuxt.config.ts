export default defineNuxtConfig({
  modules: ['../src/module'],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      betterstack: {
        sourceToken: '', // NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN
        endpoint: 'https://in.logs.betterstack.com', // NUXT_PUBLIC_BETTERSTACK_ENDPOINT
        dev: true, // NUXT_PUBLIC_BETTERSTACK_DEV - Dev mode: logs to console only
      },
    },
  },
})
