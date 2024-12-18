import { type Prefix } from '@kodadot1/static'
import type { RouteLocationRaw, RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { createVisible, transferVisible, teleportVisible, migrateVisible, swapVisible } from '@/utils/config/permission.config'

type ReplaceRouteItem = {
  cond: (route: RouteLocationNormalizedLoadedGeneric) => boolean
  replaceRoute: string | ((route: RouteLocationNormalizedLoadedGeneric) => RouteLocationRaw | string | undefined)
}

export default defineNuxtRouteMiddleware((route) => {
  const { urlPrefix } = usePrefix()

  const getPermissionRouteCondition = (cond: ReplaceRouteItem['cond'], routeVisible: (value: Prefix) => boolean) => {
    return {
      cond,
      replaceRoute: () => {
        if (!routeVisible(urlPrefix.value)) {
          return '/'
        }
      },
    }
  }

  let redirectRoute: RouteLocationRaw | null | undefined

  const paths: ReplaceRouteItem[] = [
    {
      cond: ({ path }) => path === '/drops',
      replaceRoute: '/ahp/drops',
    },
    {
      cond: ({ path }) => path === `/${urlPrefix.value}/profile`,
      replaceRoute: () => {
        const { accountId } = useAuth()
        return accountId.value ? `/${urlPrefix.value}/u/${accountId.value}` : `/${urlPrefix.value}`
      },
    },
    {
      cond: ({ name }) => name === 'prefix-u-id',
      replaceRoute: ({ params }) => {
        const address = params.id.toString()

        if (!isSub(urlPrefix.value)) {
          return
        }

        const formattedAddress = getss58AddressByPrefix(address, urlPrefix.value)

        if (address === formattedAddress) {
          return
        }

        return `/${urlPrefix.value}/u/${formattedAddress}`
      },
    },
    {
      cond: ({ path }) => ['ksm', 'rmrk', 'dot'].some(prefix => path.startsWith(`/${prefix}`) && !path.startsWith(`/${prefix}/transfer`)),
      replaceRoute: () => `/ahp`,
    },
    {
      cond: ({ path }) => path.startsWith(`/${urlPrefix.value}`) && path.endsWith('collections'),
      replaceRoute: () => `/${urlPrefix.value}/explore/collectibles`,
    },
    {
      cond: ({ path }) => path.startsWith(`/${urlPrefix.value}`) && path.endsWith('gallery'),
      replaceRoute: () => `/${urlPrefix.value}/explore/items`,
    },
    {
      cond: ({ path }) => path.includes('/stmn/'),
      replaceRoute: () => window.location.href.replace('/stmn/', '/ahk/'),
    },
    getPermissionRouteCondition(({ path }) => path === `/${urlPrefix.value}/teleport`, teleportVisible),
    getPermissionRouteCondition(({ path }) => path === `/${urlPrefix.value}/transfer`, transferVisible),
    getPermissionRouteCondition(({ path }) => path.includes(`/${urlPrefix.value}/swap`), swapVisible),
    getPermissionRouteCondition(({ path }) => path === '/migrate', migrateVisible),
    {
      cond: ({ path }) => path.startsWith('/transfer'),
      replaceRoute: () =>
        window.location.href.replace('/transfer', '/ksm/transfer'),
    },
    getPermissionRouteCondition(({ path }) =>
      path === `/${urlPrefix.value}/create`
      || path === `/${urlPrefix.value}/massmint`
      || path.startsWith('/create'), createVisible),
  ]

  for (const path of paths) {
    if (path.cond(route)) {
      redirectRoute
        = typeof path.replaceRoute === 'function'
          ? path.replaceRoute(route)
          : path.replaceRoute
      break
    }
  }

  if (redirectRoute) {
    return navigateTo(redirectRoute, { external: true })
  }
})
