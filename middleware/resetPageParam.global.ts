export default defineNuxtRouteMiddleware((to, from) => {
  const targetedPaths = [
    /\/collection\/\d+/, // collection page, like /collection/123
  ]

  const isTargetedPath = (path) =>
    targetedPaths.some((regex) => regex.test(path))

  if (isTargetedPath(to.path) && to.path !== from.path) {
    const query = { ...to.query }
    if (query.page) {
      delete query.page
      return navigateTo({ path: to.path, query })
    }
  }
})
