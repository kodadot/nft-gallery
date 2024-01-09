import type { CollectionToMintStatmine, MintCollectionParams } from '../types'
import { constructMeta } from './constructMeta'
import { useStatemineNewCollectionId } from './useNewCollectionId'
import { calculateFees, createArgsForNftPallet } from './utils'
import { SupportTokens, canSupport } from '@/utils/support'

export async function execMintCollectionStatemine({
  item,
  api,
  executeTransaction,
  isLoading,
  status,
}: MintCollectionParams) {
  const { $i18n } = useNuxtApp()

  isLoading.value = true
  status.value = 'loader.ipfs'

  const metadata = await constructMeta(item)
  const { nftCount } = item.collection as CollectionToMintStatmine
  const { accountId } = useAuth()

  const cb = api.tx.utility.batchAll

  const { nextCollectionId } = useStatemineNewCollectionId()
  const nextId = await nextCollectionId()

  const successCb = (blockNumber: string) => {
    if (item.successMessage) {
      return resolveSuccessMessage(blockNumber, item.successMessage)
    }
    return $i18n.t('mint.mintCollectionSuccess', {
      name: item.collection.name,
      block: blockNumber,
    })
  }

  const errorCb = () => {
    return (
      item.errorMessage ||
      $i18n.t('mint.errorCreateNewNft', { name: item.collection.name })
    )
  }

  const maxSupply = nftCount > 0 ? nftCount : undefined
  const createArgs = createArgsForNftPallet(accountId.value, maxSupply)

  if (!nextId) {
    return
  }

  const { enabledFees, feeMultiplier, token } = calculateFees()

  const maxSupplyArg = maxSupply
    ? [api.tx.nfts.setCollectionMaxSupply(nextId, maxSupply)]
    : []

  const arg = [
    [
      api.tx.nfts.create(...createArgs),
      api.tx.nfts.setCollectionMetadata(nextId, metadata),
      ...maxSupplyArg,
      ...(await canSupport(
        api,
        enabledFees,
        feeMultiplier,
        token as SupportTokens,
      )),
    ],
  ]

  executeTransaction({
    cb,
    arg,
    successMessage: successCb,
    errorMessage: errorCb,
  })
}
