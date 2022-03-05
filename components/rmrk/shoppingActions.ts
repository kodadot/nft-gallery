import Connector from '@kodadot1/sub-api'
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import { unpin } from '@/utils/proxy'
import { somePercentFromTX } from '@/utils/support'
import nftById from '@/queries/nftById.graphql'

export const enum ShoppingAction {
  SEND = 'SEND',
  CONSUME = 'CONSUME',
  LIST = 'LIST',
  BUY = 'BUY',
}
export const ownerActions = [
  ShoppingAction.SEND,
  ShoppingAction.CONSUME,
  ShoppingAction.LIST,
]
export const buyActions = [ShoppingAction.BUY]

export const getActions = function (
  isOwner: boolean,
  isAvailableToBuy: boolean
) {
  return isOwner ? ownerActions : isAvailableToBuy ? buyActions : []
}

const constructRmrk = (
  selectedAction,
  version,
  meta,
  nftId,
  metaValid
): string => {
  return `RMRK::${selectedAction}::${version}::${nftId}${
    metaValid ? '::' + meta : ''
  }`
}

const checkBuyBeforeSubmit = async ({
  urlPrefix,
  nftId,
  currentOwnerId,
  price,
  action,
  apollo,
}) => {
  const nft = await apollo.query({
    query: nftById,
    client: urlPrefix,
    variables: {
      id: nftId,
    },
  })

  const {
    data: { nFTEntity },
  } = nft

  if (
    nFTEntity.currentOwner !== currentOwnerId ||
    nFTEntity.burned ||
    nFTEntity.price === 0 ||
    nFTEntity.price !== price
  ) {
    showNotification(
      `[RMRK::${action}] Owner changed or NFT does not exist`,
      notificationTypes.warn
    )
    throw new ReferenceError('NFT has changed')
  }
}

export const submitAction = async ({
  action,
  accountId,
  version,
  meta,
  nftId,
  urlPrefix,
  metaValid,
  currentOwnerId,
  price,
  apollo,
  ipfsHashes,
  onResult,
  onError,
  onSuccess,
  onCatchError,
}) => {
  const { api } = Connector.getInstance()
  const rmrk = constructRmrk(action, version, meta, nftId, metaValid)

  try {
    if (!action) {
      throw new ReferenceError('No action selected')
    }
    showNotification(rmrk)
    console.log('submit', rmrk)
    const isBuy = action === ShoppingAction.BUY
    const cb = isBuy ? api.tx.utility.batchAll : api.tx.system.remark
    const arg = isBuy
      ? [
          api.tx.system.remark(rmrk),
          api.tx.balances.transfer(currentOwnerId, price),
          somePercentFromTX(price),
        ]
      : rmrk

    if (isBuy) {
      await checkBuyBeforeSubmit({
        urlPrefix,
        nftId,
        currentOwnerId,
        price,
        action,
        apollo,
      })
    }

    const statusCallback = txCb(
      async (blockHash) => {
        execResultValue(tx)
        showNotification(blockHash.toString(), notificationTypes.info)
        if (action === ShoppingAction.CONSUME) {
          unpinNFT(ipfsHashes)
        }

        showNotification(`[${action}] ${nftId}`, notificationTypes.success)
        onSuccess && onSuccess()
      },
      (err) => {
        execResultValue(tx)
        showNotification(`[ERR] ${err.hash}`, notificationTypes.danger)
        onError && onError()
      },
      onResult
    )

    const tx = await exec(accountId, '', cb, [arg], statusCallback)
  } catch (e) {
    showNotification(`[ERR] ${e}`, notificationTypes.danger)
    console.error(e)
    onCatchError && onCatchError()
  }
}

const unpinNFT = async function (ipfsHashes) {
  ipfsHashes.forEach(async (hash) => {
    if (hash) {
      try {
        await unpin(hash)
      } catch (e) {
        console.warn(`[ACTIONS] Cannot Unpin ${hash} because: ${e}`)
      }
    }
  })
}
