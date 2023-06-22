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
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { $i18n } = useNuxtApp()
  const metadata = await constructMeta(item)
  const { nftCount: maxSupply } = item.collection as CollectionToMintStatmine
  const { accountId } = useAuth()
  const transectionSent = ref(false)

  const cb = api.tx.utility.batchAll

  const { nextCollectionId, unsubFn } = useStatemineNewCollectionId()

  const successCb = (blockNumber: string) => {
    unsubFn.value && unsubFn.value()
    if (item.successMessage) {
      return resolveSuccessMessage(blockNumber, item.successMessage)
    }
    return $i18n.t('mint.mintCollectionSuccess', {
      name: item.collection.name,
      block: blockNumber,
    })
  }

  const errorCb = () => {
    unsubFn.value && unsubFn.value()
    return (
      item.errorMessage ||
      $i18n.t('mint.ErrorCreateNewNft', { name: item.collection.name })
    )
  }

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
