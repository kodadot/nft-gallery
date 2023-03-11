import { BaseMintedCollection } from '../base/types'
import { unwrapSafe } from '~~/utils/uniquery'

type MintedCollection = BaseMintedCollection & {
  name?: string
  lastIndexUsed: number
}

type QueryReposne = {
  collectionEntities: MintedCollection[]
}

export const useMassMint = () => {
  const collections = ref<MintedCollection[]>([])
  const { $consola } = useNuxtApp()
  const { accountId, isLogIn } = useAuth()
  console.log(accountId, accountId.value)

  const { urlPrefix } = usePrefix()
  const { data, loading, error } = useGraphql({
    queryPrefix: urlPrefix.value,
    queryName: 'collectionForMint',
    variables: {
      account: accountId.value,
    },
    options: {
      fetchPolicy: 'network-only',
    },
  })

  watch(data as unknown as QueryReposne, async (newData) => {
    console.log('data', data)
    const collectionEntities = newData?.collectionEntities
    if (!collectionEntities) {
      $consola.log(`collections for account ${accountId.value} not found`)
      return
    }

    collections.value = unwrapSafe(collectionEntities)?.map((ce: any) => ({
      ...ce,
      alreadyMinted: ce.nfts?.length,
      lastIndexUsed: Number(ce.nfts?.at(0)?.index || 0),
      totalCount: ce.nfts?.filter((nft) => !nft.burned).length,
    }))
  })

  return {
    collections,
    loading,
    error,
  }
}
