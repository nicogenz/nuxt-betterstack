<template>
  <div style="padding: 2rem; font-family: system-ui, sans-serif;">
    <h1>Nuxt BetterStack Module Playground</h1>

    <div style="margin: 1rem 0;">
      <h2>Test Logging</h2>
      <button
        style="margin: 0.25rem;"
        @click="logDebug"
      >
        Log Debug
      </button>
      <button
        style="margin: 0.25rem;"
        @click="logInfo"
      >
        Log Info
      </button>
      <button
        style="margin: 0.25rem;"
        @click="logWarn"
      >
        Log Warn
      </button>
      <button
        style="margin: 0.25rem;"
        @click="logError"
      >
        Log Error
      </button>
    </div>

    <div style="margin: 1rem 0;">
      <h2>Test Structured Logging</h2>
      <button
        style="margin: 0.25rem;"
        @click="logStructured"
      >
        Log with Context
      </button>
    </div>

    <div style="margin: 1rem 0;">
      <h2>Test Flush</h2>
      <button
        style="margin: 0.25rem;"
        @click="flushLogs"
      >
        Flush Logs
      </button>
    </div>

    <div style="margin: 1rem 0;">
      <h2>Test Server API</h2>
      <button
        style="margin: 0.25rem;"
        @click="callApi"
      >
        Call API Route
      </button>
      <p v-if="apiResponse">
        Response: {{ apiResponse }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const logger = useBetterstack()
const apiResponse = ref('')

function logDebug() {
  logger.debug('This is a debug message')
}

function logInfo() {
  logger.info('This is an info message')
}

function logWarn() {
  logger.warn('This is a warning message')
}

function logError() {
  logger.error('This is an error message')
}

function logStructured() {
  logger.info('User action', {
    user: {
      id: 123,
      name: 'Test User',
    },
    action: 'button_click',
    timestamp: new Date().toISOString(),
  })
}

async function flushLogs() {
  await logger.flush()
  console.log('Logs flushed!')
}

async function callApi() {
  const response = await $fetch('/api/test')
  apiResponse.value = JSON.stringify(response)
}
</script>
