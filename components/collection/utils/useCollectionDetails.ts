import { getVolume } from '@/utils/math'
import {
  CollectionMetadata,
  Interaction as InteractionType,
  NFT,
  NFTMetadata,
} from '@/components/rmrk/service/scheme'
import { NFTListSold } from '@/components/identity/utils/useIdentity'
import { chainsSupportingOffers } from './useCollectionDetails.config'
import { Interaction } from '@kodadot1/minimark'

type Stats = {
  listedCount?: number
  collectionLength?: number
  collectionFloorPrice?: number
  bestOffer?: number
  uniqueOwners?: number
  uniqueOwnersPercent?: string
  collectionTradedVolumeNumber?: bigint
}

export type CollectionEntityMinimal = {
  id: string
  issuer: string
  meta: CollectionMetadata
  metadata: string
  name: string
  currentOwner: string
  type: string
}

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
export type NFTExcludingEvents = {
  currentOwner: string
  name: string
  price?: string
  metadata: string
  meta: NFTMetadata
  updatedAt: string
  id: string
}
type InteractionWithNFT = InteractionType & {
  nft: NFTExcludingEvents
}
type NFTMap = {
  [nftId: string]: {
    owner: string
    nft: NFTExcludingEvents
    latestInteraction: Interaction
    latestPrice: number
  }
}
type FlipEvent = {
  nft: NFTExcludingEvents
  soldPrice: number
  soldTo: string
  sellTimeStamp: number
  boughtPrice: number
}

export type Flippers = {
  [identity: string]: {
    flips: FlipEvent[]
    owned: number
    totalBought: number
    totalsold: number
    bestFlip: number
    latestflipTimestamp: number
  }
}
export type Owners = {
  [identity: string]: {
    nftCount: number
    totalBought: number
    nfts: NFTExcludingEvents[]
    lastActivityTimestamp: number
  }
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
      owners.value = getOwners(result.collection.nfts)
      flippers.value = getFlippers(interactions)
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

const getFlippers = (interactions: InteractionWithNFT[]) => {
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
      const thisFlip = {
        ...baseInfo,
        boughtPrice:
          PreviousNFTState.latestInteraction === Interaction.BUY
            ? PreviousNFTState.latestPrice
            : 0,
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
  for (const flipper in flippers) {
    flippers[flipper].owned = flippers[flipper].flips.length

    flippers[flipper].totalBought = sum(
      flippers[flipper].flips.map((flip) => flip.boughtPrice)
    )
    flippers[flipper].totalsold = sum(
      flippers[flipper].flips.map((flip) => flip.soldPrice)
    )
    const flipsPercentages = flippers[flipper].flips
      .map((flip) =>
        flip.boughtPrice > 0 ? flip.soldPrice / flip.boughtPrice : 0
      )
      .filter(Boolean)
    flippers[flipper].bestFlip =
      flipsPercentages.length > 0 ? Math.max(...flipsPercentages) * 100 : 0 //to percents

    flippers[flipper].latestflipTimestamp = Math.max(
      ...flippers[flipper].flips.map((flip) => flip.sellTimeStamp)
    )
  }
  return flippers
}

const sum = (array: number[]): number =>
  array.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
