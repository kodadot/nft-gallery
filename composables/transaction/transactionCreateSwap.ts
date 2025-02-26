import type { SubmittableExtrinsic } from '@polkadot/api-base/types'
import type { CreateSwapParams } from './types'
import { BLOCKS_PER_DAY } from './transactionOffer'

async function execCreateSwapStatmine({ item, api, executeTransaction, isLoading }: CreateSwapParams) {
  isLoading.value = true

  const amountOfSwaps = item.desired.length

  const amount = Number(item.surcharge?.amount || 0) / amountOfSwaps

  const transactions = await Promise.all(
    Array.from({ length: amountOfSwaps }).map(async (_, i) => {
      const { collectionId: desiredCollectionId, sn: desiredItem } = item.desired[i]
      const { collectionId: offeredCollectionId, sn: offeredItem } = item.offered[i]

      const arg: SubmittableExtrinsic<'promise'>[] = []

      const swap = api.tx.nfts.createSwap(
        offeredCollectionId,
        offeredItem as string,
        desiredCollectionId,
        desiredItem,
        item.surcharge
          ? {
              amount,
              direction: item.surcharge.direction,
            }
          : null,
        BLOCKS_PER_DAY * item.duration,
      )

      arg.push(swap)

      return arg
    }),
  )

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [transactions.flat()],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execCreateSwap(params: CreateSwapParams) {
  if (params.item.urlPrefix === 'ahk' || params.item.urlPrefix === 'ahp') {
    await execCreateSwapStatmine(params)
  }
}
