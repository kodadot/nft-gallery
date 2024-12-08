import { type Prefix } from '@kodadot1/static'
import type { RouteLocationRaw } from 'vue-router'
import { createVisible, transferVisible, teleportVisible, migrateVisible, swapVisible } from '@/utils/config/permission.config'

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

  let redirectValue: RouteLocationRaw | null | undefined

  const paths = [
    {
      cond: (val: string) => val === '/drops',
      replaceValue: '/ahp/drops',
    },
    {
      cond: (val: string) =>
        val === `/${urlPrefix.value}/profile`,
      replaceValue: () => {
        const { accountId } = useAuth()
        return accountId.value ? `/${urlPrefix.value}/u/${accountId.value}` : `/${urlPrefix.value}`
      },
    },
    {
      cond: (val: string) => ['ksm', 'rmrk', 'dot'].some(prefix => val.startsWith(`/${prefix}`) && !val.startsWith(`/${prefix}/transfer`)),
      replaceValue: () => `/ahp`,
    },
    {
      cond: (val: string) =>
        val.startsWith(`/${urlPrefix.value}`) && val.endsWith('collections'),
      replaceValue: () => `/${urlPrefix.value}/explore/collectibles`,
    },
    {
      cond: (val: string) =>
        val.startsWith(`/${urlPrefix.value}`) && val.endsWith('gallery'),
      replaceValue: () => `/${urlPrefix.value}/explore/items`,
    },
    {
      cond: (val: string | string[]) => val.includes('/stmn/'),
      replaceValue: () => window.location.href.replace('/stmn/', '/ahk/'),
    },
    getPermissionRouteCondition((val: string) => val === `/${urlPrefix.value}/teleport`, teleportVisible),
    getPermissionRouteCondition((val: string) => val === `/${urlPrefix.value}/transfer`, transferVisible),
    getPermissionRouteCondition((val: string) => val.includes(`/${urlPrefix.value}/swap`), swapVisible),
    getPermissionRouteCondition((val: string) => val === '/migrate', migrateVisible),
    {
      cond: (val: string) => val.startsWith('/transfer'),
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
