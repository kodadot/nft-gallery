export default defineEventHandler((event) => {
  const ssrPaths = ['/privacy-policy']
  console.log(
    'event',
    event.path,
    ssrPaths.some((path) => event.path.includes(path)),
  )

  if (ssrPaths.some((path) => event.path.includes(path))) {
    return
  }

  event.context.nuxt = event.context.nuxt || {}
  event.context.nuxt.noSSR = true
})
