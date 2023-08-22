import { Prefix } from '@kodadot1/static'
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
]

function isNoRedirect(routeName: string): boolean {
  return NO_REDIRECT_ROUTE_NAMES.includes(routeName)
}

function getRedirectPathForPrefix({
  routeName,
  chain,
  accountId,
  route,
}: {
  routeName: string
  chain: Prefix
  accountId: string
  route
}): RawLocation {
  if (routeName === 'prefix-u-id') {
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
  const { accountId } = useAuth()

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
        accountId: accountId.value,
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
