import { BaseMintedCollection } from '../base/types'
import { unwrapSafe } from '@/utils/uniquery'
import resolveQueryPath from '@/utils/queryPathResolver'
import shouldUpdate from '@/utils/shouldUpdate'

export type MintedCollection = BaseMintedCollection & {
  name?: string
  lastIndexUsed: number
}

export const useMassMint = () => {
  const collectionsEntites = ref<MintedCollection[]>()
  const collections = ref()
  const { $consola, $apollo } = useNuxtApp()
  const { accountId, isLogIn } = useAuth()
  const { urlPrefix } = usePrefix()
  const queryPath = {
    rmrk: 'chain-rmrk',
    ksm: 'chain-ksm',
  }

  const doFetch = async () => {
    if (!isLogIn.value) {
      return
    }
    const prefix = queryPath[urlPrefix.value] || urlPrefix.value
    const query = await resolveQueryPath(prefix, 'collectionForMint')
    const data = await $apollo.query({
      query: query.default,
      client: urlPrefix.value,
      variables: {
        account: accountId.value,
      },
      fetchPolicy: 'network-only',
    })

    const {
      data: { collectionEntities },
    } = data

    collections.value = collectionEntities
  }

  doFetch()

  watch(accountId, (newId, oldId) => {
    if (shouldUpdate(newId, oldId)) {
      doFetch()
    }
  })

  watch(collections, () => {
    if (!collections) {
      $consola.log(`collections for account ${accountId.value} not found`)
      return
    }

    collectionsEntites.value = unwrapSafe(collections.value)
  })

  return {
    collectionsEntites,
  }
}
