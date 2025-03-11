import { type Prefix } from '@kodadot1/static'
import type { RouteLocationRaw, RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { isAddress } from '@polkadot/util-crypto'
import { createVisible, transferVisible, teleportVisible, migrateVisible, swapVisible } from '@/utils/config/permission.config'

type ReplaceRouteItemCondition = (route: RouteLocationNormalizedLoadedGeneric) => boolean

type ReplaceRouteItem = {
  cond: ReplaceRouteItemCondition
  replaceRoute: string | ((route: RouteLocationNormalizedLoadedGeneric) => RouteLocationRaw | string | undefined)
}

const getFormatAddressRouteCondition = (cond: ReplaceRouteItemCondition, { addressKey = 'id' }: { addressKey?: string } = {}): ReplaceRouteItem => {
  return {
    cond,
    replaceRoute: ({ params, name, query }) => {
      const address = params[addressKey].toString()

      if (!isAddress(address)) {
        return
      }
      const prefix = params.prefix.toString() as Prefix

      return execByVm({
        SUB: () => {
          const formattedAddress = getss58AddressByPrefix(address, prefix)

          if (address === formattedAddress) {
            return
          }

          return {
            name,
            query,
            params: {
              ...params,
              [addressKey]: formattedAddress,
            },
          }
        },
      }, { prefix })
    },
  }
}

export default defineNuxtRouteMiddleware((route) => {
  const { urlPrefix } = usePrefix()

  const getPermissionRouteCondition = (cond: ReplaceRouteItemCondition, routeVisible: (value: Prefix) => boolean): ReplaceRouteItem => {
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
    getFormatAddressRouteCondition(({ name }) => name === 'prefix-u-id'),
    getPermissionRouteCondition(({ name }) => String(name).includes('prefix-swap'), swapVisible),
    getFormatAddressRouteCondition(({ name }) => String(name).includes('prefix-swap-id')),
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
    getPermissionRouteCondition(({ path }) => path === '/migrate', migrateVisible),
    {
      cond: ({ path }) => path.startsWith('/transfer'),
      replaceRoute: () => window.location.href.replace('/transfer', '/ksm/transfer'),
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

      if (redirectRoute) {
        break
      }
    }
  }

  if (redirectRoute) {
    return navigateTo(redirectRoute, { external: true })
  }
})
