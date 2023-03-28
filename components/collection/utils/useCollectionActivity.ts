import { sum } from '@/utils/math'
import { Interaction } from '@kodadot1/minimark'
import {
  Flippers,
  InteractionWithNFT,
  NFTHistoryState,
  NFTMap,
  Offer,
  OfferInteraction,
  Owners,
} from './types'

const flipperInitialValue = {
  flips: [],
  bestFlip: 0,
  latestflipTimestamp: 0,
  owned: 0,
  totalBought: 0,
  totalsold: 0,
}

export const mintInteraction = () => {
  const { urlPrefix } = usePrefix()
  return urlPrefix.value === 'rmrk2' ? Interaction.MINT : Interaction.MINTNFT
}

const newOwnerEntry = (lastActivityTimestamp, nft) => ({
  nftCount: 1,
  totalBought: 0,
  totalSold: 0,
  lastActivityTimestamp,
  nfts: [nft],
})
const updateOwnerWithNewNft = ({
  owner,
  latestInteraction,
  lastestTimeStamp,
  nft,
}) => {
  owner.nftCount++
  owner.totalBought += parseInt(latestInteraction.meta)
  owner.lastActivityTimestamp =
    lastestTimeStamp > owner.lastActivityTimestamp
      ? lastestTimeStamp
      : owner.lastActivityTimestamp
  owner.nfts = [...owner.nfts, nft]
  return owner
}

const summerizeFlips = (flips) => {
  return {
    owned: flips.length,
    totalBought: sum(flips.map((flip) => flip.boughtPrice)),
    totalsold: sum(flips.map((flip) => flip.soldPrice)),
    bestFlip: Math.max(...flips.map((flip) => flip.profit)),
    latestflipTimestamp: Math.max(...flips.map((flip) => flip.sellTimeStamp)),
    flips,
  }
}

const getLatestPrice = (previousNFTState: NFTHistoryState) =>
  previousNFTState.latestInteraction === Interaction.BUY
    ? previousNFTState.latestPrice
    : 0

const getOffers = (nfts): Offer[] => {
  return nfts
    .map((nft) =>
      nft.offers.map((offer) => ({
        ...offer,
        price: parseInt(offer.price),
        timestamp: new Date(offer.updatedAt).getTime(),
        interaction: OfferInteraction,
        nft: { ...nft, events: undefined, offers: undefined },
      }))
    )
    .flat()
}

const getOwners = (nfts) => {
  const owners: Owners = {}

  nfts.forEach((nft) => {
    const interactions = nft.events.map((e) => e.interaction)
    const { events, ...nftExcludingEvents } = nft
    const owner = owners[nft.currentOwner]

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

      owners[nft.currentOwner] =
        owner === undefined
          ? newOwnerEntry(lastestTimeStamp, nftExcludingEvents)
          : updateOwnerWithNewNft({
              owner,
              latestInteraction,
              lastestTimeStamp,
              nft,
            })
      return
    }

    // nft isn't consumed and it hasn't change hands => it is owned by it's creator
    const mintInteraction = events[0]
    const mintTimeStamp = new Date(mintInteraction.timestamp).getTime()

    owners[nft.currentOwner] =
      owner === undefined
        ? newOwnerEntry(mintTimeStamp, nftExcludingEvents)
        : updateOwnerWithNewNft({
            owner,
            latestInteraction: mintInteraction,
            lastestTimeStamp: mintTimeStamp,
            nft,
          })
  })
  return owners
}

const preProccessForFindingFlippers = (interactions: InteractionWithNFT[]) => {
  const changeHandsInteractions: InteractionWithNFT[] = []
  const NFTS: NFTMap = {}

  interactions.forEach((event) => {
    if (event.interaction === mintInteraction()) {
      NFTS[event.nft.id] = {
        owner: event.caller,
        nft: event.nft,
        latestInteraction: mintInteraction(),
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
        flippers[PreviousNFTState.owner] = flipperInitialValue
      }

      //nft has been bought from previous owner -> previous owner is the flipper

      const boughtPrice = getLatestPrice(PreviousNFTState)
      const profit =
        boughtPrice > 0 ? (baseInfo.soldPrice / boughtPrice) * 100 : 0
      const thisFlip = {
        ...baseInfo,
        boughtPrice,
        profit,
      }

      flippers[PreviousNFTState.owner].flips = [
        ...flippers[PreviousNFTState.owner].flips,
        thisFlip,
      ]

      // update last state of NFT
      NFTS[nftId] = {
        ...PreviousNFTState,
        owner: interaction.caller,
        latestInteraction: Interaction.BUY,
        latestPrice: parseInt(interaction.meta),
      }
    }
  })

  Object.entries(flippers).forEach(([flipperId, { flips }]) => {
    flippers[flipperId] = summerizeFlips(flips)
  })
  return flippers
}

export const useCollectionActivity = ({ collectionId }) => {
  const { urlPrefix } = usePrefix()
  const events = ref<InteractionWithNFT[]>([])
  const owners = ref<Owners>()
  const flippers = ref<Flippers>()
  const offers = ref<Offer[]>([])

  const queryPrefix = urlPrefix.value === 'bsx' ? 'chain-bsx' : 'subsquid'

  const { data } = useGraphql({
    queryPrefix,
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
          nft.events.map((e) => ({
            ...e,
            timestamp: new Date(e.timestamp).getTime(),
            nft: { ...nft, events: undefined },
          }))
        )
        .flat()
      events.value = interactions

      if (urlPrefix.value === 'bsx') {
        offers.value = getOffers(result.collection.nfts)
      }

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
    offers,
  }
}
