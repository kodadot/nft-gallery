import { type Prefix } from '@kodadot1/static'
import { createVisible, transferVisible, teleportVisible, migrateVisible } from '@/utils/config/permission.config'

export default defineNuxtRouteMiddleware((route) => {
  const { urlPrefix } = usePrefix()

  const getPermissionRouteCondition = (cond: (value: string) => boolean, routeVisible: (value: Prefix) => boolean) => {
    return {
      cond,
      replaceValue: () => {
        if (!routeVisible(urlPrefix.value)) {
          return '/'
        }
      },
    }
  }

  let redirectValue

  const paths = [
    {
      cond: val => val === '/drops',
      replaceValue: '/ahp/drops',
    },
    {
      cond: val =>
        val.startsWith(`/${urlPrefix.value}`) && val.endsWith('collections'),
      replaceValue: () => `/${urlPrefix.value}/explore/collectibles`,
    },
    {
      cond: val =>
        val.startsWith(`/${urlPrefix.value}`) && val.endsWith('gallery'),
      replaceValue: () => `/${urlPrefix.value}/explore/items`,
    },
    {
      cond: val => val.includes('/stmn/'),
      replaceValue: () => window.location.href.replace('/stmn/', '/ahk/'),
    },
    getPermissionRouteCondition((val: string) => val === `/${urlPrefix.value}/teleport`, teleportVisible),
    getPermissionRouteCondition((val: string) => val === `/${urlPrefix.value}/transfer`, transferVisible),
    getPermissionRouteCondition((val: string) => val === '/migrate', migrateVisible),
    {
      cond: val => val.startsWith('/transfer'),
      replaceValue: () =>
        window.location.href.replace('/transfer', '/ksm/transfer'),
    },
    getPermissionRouteCondition((val: string) =>
      val === `/${urlPrefix.value}/create`
      || val === `/${urlPrefix.value}/massmint`
      || val.startsWith('/create'), createVisible),
  ]

  for (const path of paths) {
    if (path.cond(route.path)) {
      redirectValue
        = typeof path.replaceValue === 'function'
          ? path.replaceValue()
          : path.replaceValue
      break
    }
  }

  if (redirectValue) {
    return navigateTo(redirectValue, { external: true })
  }
})
