import type {
  ActionMintCollection,
  CollectionToMintStatmine,
  ExecuteTransactionParams,
} from '../types'
import { constructMeta } from './constructMeta'
import { useStatemineNewCollectionId } from './useNewCollectionId'
import { createArgsForNftPallet } from './utils'

export async function execMintCollectionStatemine(
  item: ActionMintCollection,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void,
) {
  const { $i18n } = useNuxtApp()
  const metadata = await constructMeta(item)
  const { nftCount } = item.collection as CollectionToMintStatmine
  const { accountId } = useAuth()
  const transectionSent = ref(false)

  const cb = api.tx.utility.batchAll

  const { nextCollectionId, unsubscribe } = useStatemineNewCollectionId()

  const successCb = (blockNumber: string) => {
    unsubscribe.value && unsubscribe.value()
    if (item.successMessage) {
      return resolveSuccessMessage(blockNumber, item.successMessage)
    }
    return $i18n.t('mint.mintCollectionSuccess', {
      name: item.collection.name,
      block: blockNumber,
    })
  }

  const errorCb = () => {
    unsubscribe.value && unsubscribe.value()
    return (
      item.errorMessage ||
      $i18n.t('mint.errorCreateNewNft', { name: item.collection.name })
    )
  }
  const maxSupply = nftCount > 0 ? nftCount : undefined

  const createArgs = createArgsForNftPallet(accountId.value, maxSupply)

  watch(nextCollectionId, (id) => {
    if (!id || transectionSent.value) {
      return
    }
    const arg = [
      [
        api.tx.nfts.create(...createArgs),
        api.tx.nfts.setCollectionMetadata(nextCollectionId, metadata),
      ],
    ]

    transectionSent.value = true
    executeTransaction({
      cb,
      arg,
      successMessage: successCb,
      errorMessage: errorCb,
    })
  })
}
