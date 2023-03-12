import { BaseMintedCollection } from '../base/types'
import { unwrapSafe } from '~~/utils/uniquery'
import resolveQueryPath from '~~/utils/queryPathResolver'
import shouldUpdate from '~~/utils/shouldUpdate'

type MintedCollection = BaseMintedCollection & {
  name?: string
  lastIndexUsed: number
}

export const useMassMint = () => {
  const collectionsEntites = ref<MintedCollection[]>()
  const collections = ref()
  const { $consola } = useNuxtApp()
  const { accountId, isLogIn } = useAuth()
  const { urlPrefix } = usePrefix()
  const { $apollo } = useNuxtApp()

  const doFetch = async () => {
    if (!isLogIn.value) {
      return
    }
    const query = await resolveQueryPath(urlPrefix.value, 'collectionForMint')
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

    collectionsEntites.value = unwrapSafe(collections.value)?.map(
      (ce: any) => ({
        ...ce,
        alreadyMinted: ce.nfts?.length,
        lastIndexUsed: Number(ce.nfts?.at(0)?.index || 0),
        totalCount: ce.nfts?.filter((nft) => !nft.burned).length,
      })
    )
  })

  return {
    collectionsEntites,
  }
}
