<template>
  <div>
    <div>basic</div>
    <div id="logger-test">
      {{ loggerStatus }}
    </div>
  </div>
</template>

<script setup>
// useBetterstack is auto-imported by the module
const logger = useBetterstack()
const loggerStatus = logger ? 'logger-available' : 'logger-unavailable'
</script>
