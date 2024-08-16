import type { Prefix } from '@kodadot1/static'
import type { ActionOffer } from './types'
import { generateId } from '@/services/dyndata'

const getOfferId = (prefix: Prefix) => {
  switch (prefix) {
    case 'ahk':
      return 464
    case 'ahp':
      return 174
    default:
      return 0
  }
}

const OFFER_MINT_PRICE = '500000000'

async function execMakingOffer(item: ActionOffer, api, executeTransaction) {
  const { accountId } = useAuth()
  const nfts = Array.isArray(item.token) ? item.token : [item.token]
  const transactions = await Promise.all(
    nfts.map(async ({ price, nftSn, collectionId }) => {
      const offerId = getOfferId(item.urlPrefix as Prefix)
      const nextId = Number.parseInt(await generateId())
      const create = api.tx.nfts.mint(
        offerId,
        nextId,
        accountId.value,
        {
          mintPrice: OFFER_MINT_PRICE,
        },
      )

      const duration = 300 // this tells about one hour (12sec /block --> 300blocks/hr)
      const offer = api.tx.nfts.createSwap(
        offerId,
        nextId,
        collectionId,
        nftSn,
        {
          amount: Number(price) || 0,
          direction: 'Send',
        },
        duration,
      )

      return [create, offer]
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
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    await execMakingOffer(item, api, executeTransaction)
  }
}
