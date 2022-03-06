import { notificationTypes, showNotification } from '@/utils/notification'
import { unpin } from '@/utils/proxy'
import nftById from '@/queries/nftById.graphql'
import { Interaction } from '@kodadot1/minimark'

export const ownerActions = [
  Interaction.SEND,
  Interaction.CONSUME,
  Interaction.LIST,
]
export const buyActions = [Interaction.BUY]

export const getActions = (isOwner: boolean, isAvailableToBuy: boolean) => {
  return isOwner ? ownerActions : isAvailableToBuy ? buyActions : []
}

export const checkBuyBeforeSubmit = async ({
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
    !nFTEntity ||
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

export const unpinNFT = async (ipfsHashes) => {
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
