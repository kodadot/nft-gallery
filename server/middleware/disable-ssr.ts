export default defineEventHandler((event) => {
  const ssrPaths = ['/privacy-policy']

  if (ssrPaths.some((path) => event.path.includes(path))) {
    return
  }

  event.context.nuxt = event.context.nuxt || {}
  event.context.nuxt.noSSR = true
})
