import type { ApiPromise } from '@polkadot/api'
import type { SubmittableExtrinsic } from '@polkadot/api-base/types'
import type { Prefix } from '@kodadot1/static'
import type { ActionOffer } from './types'
import { generateId } from '@/services/dyndata'

export const getOfferCollectionId = (prefix: Prefix) => {
  switch (prefix) {
    case 'ahk':
      return 464
    case 'ahp':
      return 174
    default:
      return 0
  }
}

export const OFFER_MINT_PRICE = 5e8

export const BLOCKS_PER_DAY = 300 * 24 // 12sec /block --> 300blocks/hr

async function execMakingOffer(item: ActionOffer, api: ApiPromise, executeTransaction) {
  const { accountId } = useAuth()

  const transactions = await Promise.all(
    item.tokens.map(async ({ price, desiredItem, desiredCollectionId, duration, offeredItem: offeredSn }) => {
      const offeredCollectionId = getOfferCollectionId(item.urlPrefix)
      let offeredItem = Number(offeredSn)

      const transactions: SubmittableExtrinsic<'promise'>[] = []

      if (!offeredItem) {
        offeredItem = Number.parseInt(await generateId())
        const create = api.tx.nfts.mint(
          offeredCollectionId,
          offeredItem,
          accountId.value,
          {
            mintPrice: String(OFFER_MINT_PRICE),
          },
        )
        transactions.push(create)
      }

      const offer = api.tx.nfts.createSwap(
        offeredCollectionId,
        offeredItem,
        desiredCollectionId,
        desiredItem,
        {
          amount: Number(price),
          direction: 'Send',
        },
        BLOCKS_PER_DAY * duration,
      )

      transactions.push(offer)

      return transactions
    }),
  )

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [transactions.flat()],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execMakingOfferTx(item: ActionOffer, api, executeTransaction) {
  if (isAssetHub(item.urlPrefix)) {
    await execMakingOffer(item, api, executeTransaction)
  }
}
