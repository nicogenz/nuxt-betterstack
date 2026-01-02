# nuxt-betterstack

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for integrating [BetterStack](https://betterstack.com) logging into your Nuxt application. Send logs from both server-side (SSR) and client-side to BetterStack with ease.

## Features

- **Dual-environment logging** - Works seamlessly on both server and client
- **Auto-import composable** - `useBetterstack()` available everywhere
- **Server utilities** - Use in API routes and server middleware
- **Dev mode** - Console-only logging during development to avoid flooding BetterStack
- **Runtime config** - Configure via environment variables for different deployments
- **Auto-flush** - Logs are automatically flushed on page unload and server shutdown
- **TypeScript support** - Fully typed API

## Installation

```bash
npm install nuxt-betterstack
```

## Setup

Add the module to your `nuxt.config.ts` and configure via `runtimeConfig`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-betterstack'],

  runtimeConfig: {
    public: {
      betterstack: {
        sourceToken: '', // Set via NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN
        endpoint: 'https://in.logs.betterstack.com',
        dev: false,
      },
    },
  },
})
```

## Configuration

All configuration is done via `runtimeConfig.public.betterstack`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sourceToken` | `string` | `''` | Your BetterStack source token |
| `endpoint` | `string` | `'https://in.logs.betterstack.com'` | The BetterStack ingesting endpoint |
| `dev` | `boolean` | `false` | Dev mode: logs to console only, does NOT send to BetterStack |

### Environment Variables

All options can be configured via environment variables:

```bash
NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN=your-token
NUXT_PUBLIC_BETTERSTACK_ENDPOINT=https://in.logs.betterstack.com
NUXT_PUBLIC_BETTERSTACK_DEV=false
```

## Dev Mode

When `dev: true`, all logging behavior changes:

- **Logs** are printed to console only, not sent to BetterStack

This prevents flooding your BetterStack logs during development while still giving you visibility in your terminal/browser console.

```ts
export default defineNuxtConfig({
  modules: ['nuxt-betterstack'],

  runtimeConfig: {
    public: {
      betterstack: {
        sourceToken: '', // NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN
        dev: process.env.NODE_ENV === 'development',
      },
    },
  },
})
```

## Usage

### In Vue Components

```vue
<script setup>
const logger = useBetterstack()

function handleClick() {
  logger.info('Button clicked', { 
    userId: user.id,
    action: 'purchase' 
  })
}

async function handlePurchase() {
  try {
    await processPurchase()
    logger.info('Purchase completed')
  } catch (error) {
    logger.error('Purchase failed', { error: error.message })
  }
}
</script>
```

### In API Routes

```ts
// server/api/users.ts
export default defineEventHandler(async (event) => {
  const logger = useBetterstack()
  
  logger.info('Fetching users', { 
    path: '/api/users' 
  })
  
  const users = await getUsers()
  return users
})
```

### Log Levels

The logger provides four log levels:

```ts
const logger = useBetterstack()

logger.debug('Debug message', { context: 'optional' })
logger.info('Info message', { context: 'optional' })
logger.warn('Warning message', { context: 'optional' })
logger.error('Error message', { context: 'optional' })
```

### Flushing Logs

Logs are automatically flushed before page unload (client) and server shutdown. You can also manually flush:

```ts
const logger = useBetterstack()

await logger.info('Important action')
await logger.flush() // Ensure logs are sent before redirect
navigateTo('/thank-you')
```

## Development

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

## License

MIT

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-betterstack/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-betterstack

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-betterstack.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-betterstack

[license-src]: https://img.shields.io/npm/l/nuxt-betterstack.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-betterstack

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
