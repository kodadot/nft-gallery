import { getExpiration } from '@/utils/api/bsx/query'
import { calculateBalance } from '@/utils/format/balance'
import { bsxParamResolver, getApiCall } from '@/utils/gallery/abstractCalls'
import { dangerMessage } from '@/utils/notification'
import { ShoppingActions } from '@/utils/shoppingActions'

import type { ActionOffer } from './types'

export async function execMakeOfferTx(
  item: ActionOffer,
  api,
  executeTransaction
) {
  try {
    const currentBlock = await (await api.query.system.number()).toNumber()
    const expiration = getExpiration(currentBlock, item.day)
    const meta = calculateBalance(item.price)

    executeTransaction({
      cb: getApiCall(api, item.urlPrefix, ShoppingActions.MAKE_OFFER),
      arg: bsxParamResolver(
        item.tokenId,
        ShoppingActions.MAKE_OFFER,
        meta,
        item.currentOwner,
        expiration
      ),
    })
  } catch (error) {
    dangerMessage(error)
  }
}
