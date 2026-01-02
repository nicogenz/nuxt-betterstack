import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  betterstack: {
    sourceToken: 'test-token',
    dev: true, // Dev mode for testing - logs to console only
  },
})
