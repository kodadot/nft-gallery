import type { ApiPromise } from '@polkadot/api'
import type { ActionAcceptOffer } from './types'
import { getOfferCollectionId } from './transactionOffer'

async function execAcceptOffer(item: ActionAcceptOffer, api: ApiPromise, executeTransaction) {
  const arg = [
    Number(item.collectionId), // send collection
    Number(item.nftId), // send nft
    getOfferCollectionId(item.urlPrefix), // receive collection
    Number(item.offeredId), // receive nft
    {
      amount: Number(item.price),
      direction: 'Send',
    },
  ]

  executeTransaction({
    cb: api.tx.nfts.claimSwap,
    arg,
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execAcceptOfferTx(item: ActionAcceptOffer, api, executeTransaction) {
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    await execAcceptOffer(item, api, executeTransaction)
  }
}
