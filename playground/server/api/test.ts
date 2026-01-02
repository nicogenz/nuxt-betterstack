// useBetterstack is auto-imported by the module
export default defineEventHandler(async () => {
  const logger = useBetterstack()
  
  // Log from the server side
  await logger.info('API route called', {
    path: '/api/test',
    method: 'GET',
    timestamp: new Date().toISOString(),
  })

  return {
    success: true,
    message: 'Hello from the API!',
    loggedAt: new Date().toISOString(),
  }
})
