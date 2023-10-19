import { CHAINS, Prefix } from '@kodadot1/static'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import {
  assetsVisible,
  createVisible,
  incomingOfferssVisible,
} from '@/utils/config/permission.config'
import { RawLocation } from 'vue-router/types/router'

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

function isNoRedirect(routeName: string): boolean {
  return NO_REDIRECT_ROUTE_NAMES.includes(routeName)
}

const getAddress = (chain: string, accountId: string) => {
  const publicKey = decodeAddress(accountId)
  return encodeAddress(publicKey, CHAINS[chain].ss58Format)
}

function getRedirectPathForPrefix({
  routeName,
  chain,
  route,
}: {
  routeName: string
  chain: Prefix
  route
}): RawLocation {
  if (routeName === 'prefix-u-id') {
    const accountId = getAddress(chain, route.params.id)

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
    const { isAssetHub } = useIsChain(computed(() => chain))

    // https://github.com/kodadot/nft-gallery/pull/7742#issuecomment-1771105341
    if (isAssetHub.value && restOfQuery.sort) {
      restOfQuery.sort = restOfQuery.sort.filter(
        (value) => !value.startsWith('instance_'),
      )
    }
    return {
      params: {
        prefix: chain,
      },
      query: restOfQuery,
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

    const isAssets = routeName.includes('-assets')
    const isSimpleCreate = routeName.includes('-create')
    const isIncomingOffers = routeName.includes('-incomingOffers')

    let redirectLocation: RawLocation = { path: `/${newChain}` }

    if (route.params.prefix) {
      redirectLocation = getRedirectPathForPrefix({
        routeName,
        chain: newChain,
        route,
      })
    } else if (isAssets && assetsVisible(newChain)) {
      redirectLocation = { path: `/${newChain}/assets` }
    } else if (isSimpleCreate && createVisible(newChain)) {
      redirectLocation = { path: `/${newChain}/create` }
    } else if (isIncomingOffers && incomingOfferssVisible(newChain)) {
      redirectLocation = { path: `/${newChain}/incomingoffers` }
    }

    router.push(redirectLocation)
  }

  return {
    redirectAfterChainChange,
  }
}
