import { MintDropParams } from './types'

export function execMintDrop({
  item,
  api,
  executeTransaction,
  isLoading,
}: MintDropParams) {
  const { accountId } = useAuth()

  const args = item.nfts.map((allocatedNft, index) =>
    api.tx.nfts.mint(item?.collectionId, allocatedNft.id, accountId.value, {
      ownedItem: (item.availableSerialNumbers || [])[index] || null,
      mintPrice: item.price || null,
    }),
  )
  isLoading.value = true

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [args],
  })
}
