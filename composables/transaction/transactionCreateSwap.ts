import type { Prefix } from '@kodadot1/static'
import type { SubmittableExtrinsic } from '@polkadot/api-base/types'
import type { CreateSwapParams } from './types'
import { getOfferCollectionId, OFFER_MINT_PRICE, BLOCKS_PER_DAY } from './transactionOffer'
import { generateId } from '@/services/dyndata'

async function execCreateSwapStatmine({ item, api, executeTransaction, isLoading }: CreateSwapParams) {
  const { accountId } = useAuth()

  isLoading.value = true

  const amountOfSwaps = Math.max(item.offered.length, item.desired.length)

  const amount = Number(item.surcharge?.amount || 0) * amountOfSwaps
  const amountOfDustTokensToCreate = item.desired.length - item.offered.length

  const transactions = await Promise.all(
    Array.from({ length: amountOfSwaps }).map(async (_, i) => {
      const arg = [] as SubmittableExtrinsic<'promise'>[]
      let offeredCollectionId: string,
        offeredItem: string

      const desiredCollectionId = item.desired[i].collectionId
      const desiredItem = item.desired[i].sn

      if (item.offered[i]) {
        offeredCollectionId = item.offered[i].collectionId
        offeredItem = item.offered[i].sn
      }
      else {
        const collectionId = getOfferCollectionId(item.urlPrefix as Prefix)
        const nextId = Number.parseInt(await generateId())
        const create = api.tx.nfts.mint(
          collectionId,
          nextId,
          accountId.value,
          {
            mintPrice: String(OFFER_MINT_PRICE / amountOfDustTokensToCreate),
          },
        )

        offeredCollectionId = collectionId.toString()
        offeredItem = nextId.toString()

        arg.push(create)
      }

      const swap = api.tx.nfts.createSwap(
        offeredCollectionId,
        offeredItem,
        desiredCollectionId,
        desiredItem,
        item.surcharge
          ? {
              amount,
              direction: item.surcharge.direction,
            }
          : undefined,
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

export async function execCreateSwapTx(params: CreateSwapParams) {
  if (params.item.urlPrefix === 'ahk' || params.item.urlPrefix === 'ahp') {
    await execCreateSwapStatmine(params)
  }
}
