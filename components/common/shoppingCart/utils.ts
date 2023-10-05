import { calculateExactUsdFromToken } from '@/utils/calculation'
import { ListCartItem } from '@/stores/listingCart'
import { ShoppingCartItem } from './types'
import { useFiatStore } from '@/stores/fiat'
import { sum } from '@/utils/math'
import { NFT } from '@/components/rmrk/service/scheme'
import { chainPropListOf } from '@/utils/config/chain.config'

export const prefixToToken = {
  ksm: 'KSM',
  rmrk: 'KSM',
  bsx: 'KSM',
  snek: 'KSM',
  ahk: 'KSM',
  ahp: 'DOT',
  dot: 'DOT',
}

const getTokenDecimal = (item: ShoppingCartItem) => {
  const token = prefixToToken[item.urlPrefix]
  return chainPropListOf(token.toLowerCase()).tokenDecimals
}

export const totalPriceUsd = (items: ShoppingCartItem[]) => {
  const fiatStore = useFiatStore()

  const nftSPrice = items.map((item) =>
    calculateExactUsdFromToken(
      Number(item.price) * Math.pow(10, -getTokenDecimal(item)),
      Number(fiatStore.getCurrentTokenValue(prefixToToken[item.urlPrefix])),
    ),
  )

  const royalties = items.map((item) =>
    item.royalty
      ? calculateExactUsdFromToken(
          Number(item.royalty.amount) * Math.pow(10, -getTokenDecimal(item)),
          Number(fiatStore.getCurrentTokenValue(prefixToToken[item.urlPrefix])),
        )
      : 0,
  )

  return {
    nfts: sum(nftSPrice),
    royalties: sum(royalties),
  }
}

export const nftToShoppingCartItem = (nft: NFT): ShoppingCartItem => {
  const { urlPrefix } = usePrefix()
  return {
    id: nft.id,
    name: nft.name,
    currentOwner: nft.currentOwner,
    price: nft.price ?? '0',
    urlPrefix: urlPrefix.value,
    collection: nft.collection,
    royalty: nft.royalty
      ? { amount: nft.royalty, address: nft.recipient ?? '' }
      : undefined,
    addedAt: new Date().getTime(),
    metadata: nft.metadata,
    meta: nft.meta,
  }
}

export const nftToListingCartItem = (nft: NFT, floor = ''): ListCartItem => {
  const { urlPrefix } = usePrefix()

  return {
    id: nft.id,
    name: nft.name,
    price: nft.price ?? '0',
    urlPrefix: urlPrefix.value,
    collection: {
      ...nft.collection,
      floor,
    },
    listPrice: null,
    metadata: nft.metadata,
    meta: nft.meta,
  }
}
