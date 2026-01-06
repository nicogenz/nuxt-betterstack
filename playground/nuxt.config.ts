export default defineNuxtConfig({
  modules: ['../src/module'],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      betterstack: {
        sourceToken: '', // NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN
        endpoint: '', // NUXT_PUBLIC_BETTERSTACK_ENDPOINT
      },
    },
  },
})
