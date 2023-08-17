import { Prefix } from '@kodadot1/static'
import { createVisible } from '@/utils/config/permision.config'

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

    const isSimpleCreate = routeName.includes('-create')

    if (isSimpleCreate && createVisible(newChain)) {
      return router.push({
        path: `/${newChain}/create`,
      })
    } else if (route.params.prefix) {
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
        const routeNameToRiredrect = routeName?.includes('gallery')
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
