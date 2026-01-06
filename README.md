# nuxt-betterstack

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for integrating [BetterStack](https://betterstack.com) logging into your Nuxt application. Send logs from
both server-side (SSR) and client-side to BetterStack with ease.

## Features

- **Dual-environment logging** - Works seamlessly on both server and client
- **Auto-import composable** - `useBetterstack()` available everywhere
- **Server utilities** - Use in API routes and server middleware
- **Flexible configuration** - Use public config for client+server or private config for server-only
- **Runtime config** - Configure via environment variables for different deployments
- **TypeScript support** - Fully typed API

## Installation

```bash
npm install nuxt-betterstack
```

## Setup

Add the module to your `nuxt.config.ts` and configure via `runtimeConfig`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-betterstack']
})
```

## Configuration

The module supports two configuration approaches via `runtimeConfig`:

### Public Configuration (Client + Server)

Use `runtimeConfig.public.betterstack` when you need logging on both client and server:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-betterstack'],

  runtimeConfig: {
    public: {
      betterstack: {
        sourceToken: 'your-token', // Set via NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN
        endpoint: 'https://your-endpoint', // Set via NUXT_PUBLIC_BETTERSTACK_ENDPOINT
      },
    },
  },
})
```

### Private Configuration (Server Only)

Use `runtimeConfig.betterstack` for server-side only logging. This keeps your token private and out of the client bundle:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-betterstack'],

  runtimeConfig: {
    betterstack: {
      sourceToken: 'your-token', // Set via NUXT_BETTERSTACK_SOURCE_TOKEN
      endpoint: 'https://your-endpoint', // Set via NUXT_BETTERSTACK_ENDPOINT
    },
  },
})
```

### Options

| Option        | Type     | Description                        |
|---------------|----------|------------------------------------|
| `sourceToken` | `string` | Your BetterStack source token      |
| `endpoint`    | `string` | The BetterStack ingesting endpoint |

### Environment Variables

| Config Type | Variable                              |
|-------------|---------------------------------------|
| Public      | `NUXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN` |
| Public      | `NUXT_PUBLIC_BETTERSTACK_ENDPOINT`     |
| Private     | `NUXT_BETTERSTACK_SOURCE_TOKEN`        |
| Private     | `NUXT_BETTERSTACK_ENDPOINT`            |

### Security Considerations

- **Use private config** if you only need server-side logging (API routes, server middleware). This prevents your BetterStack token from being exposed to the client.
- **Use public config** if you need client-side logging (Vue components, browser events). Be aware that the token will be visible in the client bundle.
- You can use both configurations together: private config for sensitive server logs and public config for general client-side telemetry (using separate BetterStack sources).

## Graceful Fallback

When `sourceToken` or `endpoint` is not configured, logs are simply not sent to BetterStack. This allows you to safely run your application locally or in development without flooding your BetterStack logs.

## Usage

### In Vue Components

```vue

<script setup>
  const logger = useBetterstack()

  function handleClick () {
    logger.info('Button clicked', {
      userId: user.id,
      action: 'purchase'
    })
  }

  async function handlePurchase () {
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

logger.debug('Debug message', {context: 'optional'})
logger.info('Info message', {context: 'optional'})
logger.warn('Warning message', {context: 'optional'})
logger.error('Error message', {context: 'optional'})
```

### Flushing Logs
You can manually flush logs to ensure they are sent to BetterStack:

```ts
const logger = useBetterstack()

await logger.info('Important action')
await logger.flush() // Ensure logs are sent before redirect
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
