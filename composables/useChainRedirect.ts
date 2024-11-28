import type { Prefix } from '@kodadot1/static'
import type { RouteLocationRaw, RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { createVisible } from '@/utils/config/permission.config'
import { arePrefixesOfSameVm } from '@/utils/config/chain.config'
import { getss58AddressByPrefix } from '@/utils/account'

const NO_REDIRECT_ROUTE_NAMES = [
  'hot',
  'sales',
  'series-insight',
  'identity',
  'blog',
  'blog-slug',
  'create-nft',
  'create-collection',
]

const REDIRECT_HOME_ON_VM_CHANGE_ROUTE_NAMES = [
  'prefix-u-id',
]

function isNoRedirect(routeName: string): boolean {
  return NO_REDIRECT_ROUTE_NAMES.includes(routeName)
}

const clearInstanceSortFromQuery = (query) => {
  if (Array.isArray(query.sort)) {
    query.sort = query.sort.filter(value => !value.startsWith('instance_'))
    return query
  }

  if (query.sort?.startsWith('instance_')) {
    const { _sort, ...restOfQuery } = query
    return restOfQuery
  }

  return query
}

function getRedirectPathForPrefix({
  routeName,
  chain,
  route,
}: {
  routeName: string
  chain: Prefix
  route: RouteLocationNormalizedLoadedGeneric
}): RouteLocationRaw {
  if (!arePrefixesOfSameVm(route.params.prefix.toString() as Prefix, chain) && REDIRECT_HOME_ON_VM_CHANGE_ROUTE_NAMES.includes(routeName)) {
    return { path: `/${chain}` }
  }

  if (routeName === 'prefix-u-id') {
    const accountId = getss58AddressByPrefix(route.params.id.toString(), chain)

    delete route.query.collections

    return {
      params: {
        prefix: chain,
        id: accountId,
      },
      query: route.query,
    }
  }

  if (['prefix-gallery-id', 'prefix-collection-id'].includes(routeName)) {
    const routeNameToRedirect = routeName.includes('gallery')
      ? 'prefix-explore-items'
      : 'prefix-explore-collectibles'

    return {
      name: routeNameToRedirect,
      params: {
        prefix: chain,
      },
    }
  }

  if (route.name === 'prefix-explore-items') {
    const { collections: _c, page: _p, ...restOfQuery } = route.query

    // https://github.com/kodadot/nft-gallery/pull/7742#issuecomment-1771105341
    const finalQuery
      = restOfQuery.sort
        ? clearInstanceSortFromQuery(restOfQuery)
        : restOfQuery
    return {
      params: {
        prefix: chain,
      },
      query: finalQuery,
    }
  }

  return {
    params: {
      prefix: chain,
    },
    query: route.query,
  }
}

export default function () {
  const route = useRoute()
  const router = useRouter()

  const redirectAfterChainChange = (newChain: Prefix): void => {
    const routeName = route.name as string

    if (isNoRedirect(routeName)) {
      return
    }

    const isSimpleCreate = routeName.includes('-create')

    let redirectLocation: RouteLocationRaw = { path: `/${newChain}` }

    if (route.params.prefix) {
      redirectLocation = getRedirectPathForPrefix({
        routeName,
        chain: newChain,
        route,
      })
    }
    else if (isSimpleCreate && createVisible(newChain)) {
      redirectLocation = { path: `/${newChain}/create` }
    }

    router.push(redirectLocation)
  }

  return {
    redirectAfterChainChange,
  }
}
