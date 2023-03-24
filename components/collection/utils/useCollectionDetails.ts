import { getVolume, sum } from '@/utils/math'
import { NFT } from '@/components/rmrk/service/scheme'
import { NFTListSold } from '@/components/identity/utils/useIdentity'
import { chainsSupportingOffers } from './useCollectionDetails.config'
import { Interaction } from '@kodadot1/minimark'
import { Flippers, InteractionWithNFT, NFTMap, Owners, Stats } from './types'

const differentOwner = (nft: {
  issuer: string
  currentOwner: string
}): boolean => {
  return nft.currentOwner !== nft.issuer
}

export const useCollectionDetails = ({ collectionId }) => {
  const { urlPrefix } = usePrefix()
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: chainsSupportingOffers.includes(urlPrefix.value)
      ? 'collectionStatsByIdWithOffers'
      : 'collectionStatsById',
    variables: {
      id: collectionId,
    },
  })
  const stats = ref<Stats>({})

  watch(data, () => {
    if (data.value.stats) {
      const uniqueOwnerCount = [
        ...new Set(data.value.stats?.base.map((item) => item.currentOwner)),
      ].length

      const differentOwnerCount =
        data.value.stats.base.filter(differentOwner).length

      const maxOffer = computed(() => {
        if (!chainsSupportingOffers.includes(urlPrefix.value)) {
          return undefined
        }
        const offresPerNft = data.value.stats.base.map((nft) =>
          nft.offers.map((offer) => Number(offer.price))
        )
        const highestOffer = Math.max(
          ...offresPerNft.map((nftOffers) => Math.max(...nftOffers))
        )
        return highestOffer
      })

      stats.value = {
        listedCount: data.value.stats.listed.length,
        collectionLength: data.value.stats.base.length,
        collectionFloorPrice: Math.min(
          ...data.value.stats.listed.map((item) => parseInt(item.price))
        ),
        uniqueOwners: uniqueOwnerCount,
        bestOffer: maxOffer.value,
        uniqueOwnersPercent: `${(
          (uniqueOwnerCount / (uniqueOwnerCount + differentOwnerCount)) *
          100
        ).toFixed(2)}%`,
        collectionTradedVolumeNumber: getVolume(
          data.value.stats.sales.map((nft) => nft.events).flat()
        ),
      }
    }
  })

  return {
    stats,
  }
}

export const useBuyEvents = ({ collectionId }) => {
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'collectionBuyEventStatsById',
    variables: {
      id: collectionId,
    },
  })
  const highestBuyPrice = ref<number>(0)
  watch(data, () => {
    if (data && data.value.stats && data.value.stats[0]) {
      const { max } = data.value.stats[0]
      highestBuyPrice.value = parseInt(max)
    }
  })
  return { highestBuyPrice }
}

export function useCollectionSoldData({ address, collectionId }) {
  const nftEntities = ref<NFT[]>([])

  const { data } = useGraphql({
    queryName: 'nftListSoldByCollection',
    variables: {
      account: address,
      limit: 3,
      orderBy: 'price_DESC',
      collectionId,
      where: {
        collection: { id_eq: collectionId },
      },
    },
  })

  watch(data as unknown as NFTListSold, (list) => {
    if (list.nftEntities?.length) {
      nftEntities.value = list.nftEntities
    }
  })

  return { nftEntities }
}

export const useCollectionMinimal = ({ collectionId }) => {
  const collection = ref<CollectionEntityMinimal>()

  const { data } = useGraphql({
    queryName: 'collectionByIdMinimal',
    variables: {
      id: collectionId,
    },
  })

  watch(data, (result) => {
    if (result?.collectionEntityById) {
      collection.value = result.collectionEntityById
    }
  })
  return { collection }
}

export const useCollectionActivity = ({ collectionId }) => {
  const events = ref<InteractionWithNFT[]>()
  const owners = ref<Owners>()
  const flippers = ref<Flippers>()

  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'collectionActivityEvents',
    variables: {
      id: collectionId,
    },
  })

  watch(data, (result) => {
    if (result?.collection) {
      // flat events for chart
      const interactions: InteractionWithNFT[] = result.collection.nfts
        .map((nft) =>
          nft.events.map((e) => ({ ...e, nft: { ...nft, events: undefined } }))
        )
        .flat()
      events.value = interactions

      // not to repeat ref names
      const ownersTemp = getOwners(result.collection.nfts)
      const flippersTemp = getFlippers(interactions)

      const flipperdIds = Object.keys(flippersTemp)
      const OwnersIds = Object.keys(ownersTemp)

      flipperdIds.forEach((id) => {
        if (OwnersIds.includes(id)) {
          ownersTemp[id].totalSold = flippersTemp[id].totalsold
        }
      })

      owners.value = ownersTemp
      flippers.value = flippersTemp
    }
  })
  return {
    events,
    owners,
    flippers,
  }
}

const getOwners = (nfts) => {
  const owners: Owners = {}

  nfts.forEach((nft) => {
    const interactions = nft.events.map((e) => e.interaction)
    const { events, ...nftExcludingEvents } = nft

    if (interactions.includes(Interaction.CONSUME)) {
      // no owner
      return
    }
    if (
      interactions.includes(Interaction.BUY) ||
      interactions.includes(Interaction.SEND)
    ) {
      // NFT changed hands
      const latestInteraction = events[events.length - 1]
      const lastestTimeStamp = new Date(latestInteraction.timestamp).getTime()

      const owner = owners[nft.currentOwner]
      if (owner) {
        // update entry
        owner.nftCount++
        owner.totalBought += parseInt(latestInteraction.meta)
        owner.lastActivityTimestamp =
          lastestTimeStamp > owner.lastActivityTimestamp
            ? lastestTimeStamp
            : owner.lastActivityTimestamp
        owner.nfts = [...owner.nfts, nftExcludingEvents]
        return
      }
      // new owner entry
      owners[nft.currentOwner] = {
        nftCount: 1,
        totalBought: parseInt(latestInteraction.meta),
        lastActivityTimestamp: lastestTimeStamp,
        nfts: [nftExcludingEvents],
      }
      return
    }

    // nft isn't consumed and it hasn't change hands => it is owned by it's creator
    const mintInteraction = events[0]
    const mintTimeStamp = new Date(mintInteraction.timestamp).getTime()
    const owner = owners[nft.currentOwner]

    if (owner) {
      // update entry
      owner.nftCount++
      owner.lastActivityTimestamp =
        mintTimeStamp > owner.lastActivityTimestamp
          ? mintTimeStamp
          : owner.lastActivityTimestamp
      owner.nfts = [...owner.nfts, nftExcludingEvents]
      return
    }
    // new owner entry
    owners[nft.currentOwner] = {
      nftCount: 1,
      totalBought: 0,
      lastActivityTimestamp: mintTimeStamp,
      nfts: [nftExcludingEvents],
    }
  })
  return owners
}

const preProccessForFindingFlippers = (interactions: InteractionWithNFT[]) => {
  const changeHandsInteractions: InteractionWithNFT[] = []
  const NFTS: NFTMap = {}

  interactions.forEach((event) => {
    if (event.interaction === Interaction.MINTNFT) {
      // mintInteractions.push(event)
      NFTS[event.nft.id] = {
        owner: event.caller,
        nft: event.nft,
        latestInteraction: Interaction.MINTNFT,
        latestPrice: 0,
      }
    }

    if (
      event.interaction === Interaction.SEND ||
      event.interaction === Interaction.BUY
    ) {
      changeHandsInteractions.push(event)
    }
  })

  return { NFTS, changeHandsInteractions }
}

const getFlippers = (interactions: InteractionWithNFT[]): Flippers => {
  const { NFTS, changeHandsInteractions } =
    preProccessForFindingFlippers(interactions)

  const flippers: Flippers = {}

  changeHandsInteractions.forEach((interaction) => {
    if (interaction.interaction === Interaction.SEND) {
      NFTS[interaction.nft.id].owner = interaction.meta
      NFTS[interaction.nft.id].latestInteraction = Interaction.SEND
    }
    if (interaction.interaction === Interaction.BUY) {
      //it's a Flip!

      const nftId = interaction.nft.id
      const PreviousNFTState = NFTS[nftId]
      const baseInfo = {
        nft: NFTS[nftId].nft,
        soldPrice: parseInt(interaction.meta),
        soldTo: interaction.caller,
        sellTimeStamp: new Date(interaction.timestamp).getTime(),
      }
      if (flippers[PreviousNFTState.owner] === undefined) {
        flippers[PreviousNFTState.owner] = {
          flips: [],
          bestFlip: 0,
          latestflipTimestamp: 0,
          owned: 0,
          totalBought: 0,
          totalsold: 0,
        }
      }

      //nft has been bought from previous owner -> previous owner is the flipper

      const flipperHistory = flippers[PreviousNFTState.owner].flips
      const boughtPrice =
        PreviousNFTState.latestInteraction === Interaction.BUY
          ? PreviousNFTState.latestPrice
          : 0
      const profit =
        boughtPrice > 0 ? (baseInfo.soldPrice / boughtPrice) * 100 : 0
      const thisFlip = {
        ...baseInfo,
        boughtPrice,
        profit,
      }

      flippers[PreviousNFTState.owner].flips = [...flipperHistory, thisFlip]

      // update last state of NFT
      NFTS[nftId] = {
        ...PreviousNFTState,
        owner: interaction.caller,
        latestInteraction: interaction.interaction,
        latestPrice: parseInt(interaction.meta),
      }
    }
  })

  Object.entries(flippers).forEach(([flipperId, { flips }]) => {
    flippers[flipperId] = {
      owned: flips.length,
      totalBought: sum(flips.map((flip) => flip.boughtPrice)),
      totalsold: sum(flips.map((flip) => flip.soldPrice)),
      bestFlip: Math.max(...flips.map((flip) => flip.profit)),
      latestflipTimestamp: Math.max(...flips.map((flip) => flip.sellTimeStamp)),
      flips,
    }
  })
  return flippers
}
