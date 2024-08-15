import type { SubmittableExtrinsic } from '@polkadot/api-base/types'
import type { ISubmittableResult } from '@polkadot/types/types'
import type { CollectionToMintStatmine, MintCollectionParams } from '../types'
import { constructMeta } from './constructMeta'
import { useStatemineNewCollectionId } from './useNewCollectionId'
import { calculateFees, createArgsForNftPallet } from './utils'
import { canSupport } from '@/utils/support'
import type { SupportTokens } from '@/utils/support'

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
  const { nftCount, royalty, hasRoyalty }
    = item.collection as CollectionToMintStatmine
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
      item.errorMessage
      || $i18n.t('mint.errorCreateNewNft', { name: item.collection.name })
    )
  }

  const maxSupply = nftCount > 0 ? nftCount : undefined
  const createArgs = createArgsForNftPallet(accountId.value, maxSupply)

  if (!nextId) {
    return
  }

  const { enabledFees, feeMultiplier, token } = calculateFees()

  // tmp solution, remove when maxSupply bug is fixed, see #8391
  const maxSupplyArg = maxSupply
    ? [api.tx.nfts.setCollectionMaxSupply(nextId, maxSupply)]
    : []

  const royaltyArgs: SubmittableExtrinsic<'promise', ISubmittableResult>[] = []
  if (royalty && isRoyaltyValid(royalty) && hasRoyalty) {
    const setRoyaltyAmount = api.tx.nfts.setAttribute(
      nextId,
      null,
      'CollectionOwner',
      'royalty',
      royalty.amount.toString(),
    )
    const setRoyaltyRecipient = api.tx.nfts.setAttribute(
      nextId,
      null,
      'CollectionOwner',
      'recipient',
      royalty.address,
    )
    royaltyArgs.push(setRoyaltyAmount, setRoyaltyRecipient)
  }

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
      ...royaltyArgs,
    ],
  ]

  executeTransaction({
    cb,
    arg,
    successMessage: successCb,
    errorMessage: errorCb,
  })
}
