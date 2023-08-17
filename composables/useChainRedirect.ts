import { Prefix } from '@kodadot1/static'
import {
  assetsVisible,
  createVisible,
  incomingOfferssVisible,
} from '@/utils/config/permision.config'

const NO_REDIRECT_ROUTE_NAMES = ['hot', 'sales', 'series-insight', 'identity']

export default function () {
  const route = useRoute()
  const router = useRouter()
  const { accountId } = useAuth()

  const redirectAfterChainChange = (newChain: Prefix) => {
    const routeName = route.name as string

    if (NO_REDIRECT_ROUTE_NAMES.includes(routeName)) {
      return
    }

    const isAssets = routeName.includes('-assets')
    const isSimpleCreate = routeName.includes('-create')
    const isIncomingOffers = routeName.includes('-incomingOffers')

    if (route.params.prefix) {
      if (routeName === 'prefix-u-id') {
        return router.push({
          params: {
            prefix: newChain,
            id: accountId.value,
          },
          query: route.query,
        })
      }

      if (['prefix-gallery-id', 'prefix-collection-id'].includes(routeName)) {
        const routeNameToRiredrect = routeName.includes('gallery')
          ? 'prefix-explore-items'
          : 'prefix-explore-collectibles'

        return router.push({
          name: routeNameToRiredrect,
          params: {
            prefix: newChain,
          },
        })
      }

      router.push({
        params: {
          prefix: newChain,
        },
        query: route.query,
      })
    } else if (isAssets && assetsVisible(newChain)) {
      router.push({
        path: `/${newChain}/assets`,
      })
    } else if (isSimpleCreate && createVisible(newChain)) {
      router.push({
        path: `/${newChain}/create`,
      })
    } else if (isIncomingOffers && incomingOfferssVisible(newChain)) {
      router.push({
        path: `/${newChain}/incomingoffers`,
      })
    } else {
      router.push({
        path: `/${newChain}`,
      })
    }
  }

  return {
    redirectAfterChainChange,
  }
}
