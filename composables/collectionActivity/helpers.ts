import { Interaction } from '@kodadot1/minimark/v1'
import { sum } from '@/utils/math'
import {
  Flippers,
  InteractionWithNFT,
  NFTHistoryState,
  NFTMap,
  Offer,
  OfferInteraction,
  Owners,
} from './types'

export const mintInteraction = () => {
  const { urlPrefix } = usePrefix()
  return urlPrefix.value === 'ksm' ? Interaction.MINT : Interaction.MINTNFT
}

const flipperInitialState = () => ({
  flips: [],
  bestFlip: 0,
  latestflipTimestamp: 0,
  owned: 0,
  totalBought: 0,
  totalsold: 0,
})

const newOwnerEntry = () => ({
  nftCount: 0,
  totalBought: 0,
  totalSold: 0,
  lastActivityTimestamp: -Infinity,
  nfts: [],
})

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

const updateOwnerWithNewNft = ({
  owner,
  latestEvent,
  lastestTimeStamp,
  nft,
}) => {
  owner.nftCount++
  if (latestEvent.interaction === Interaction.BUY) {
    owner.totalBought += parseInt(latestEvent.meta)
  }

  owner.lastActivityTimestamp =
    lastestTimeStamp > owner.lastActivityTimestamp
      ? lastestTimeStamp
      : owner.lastActivityTimestamp
  owner.nfts = [...owner.nfts, nft]
  return owner
}

export const getOffers = (nfts): Offer[] => {
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

export const getOwners = (nfts) => {
  const owners: Owners = {}

  nfts.forEach((nft) => {
    const interactions = nft.events.map((e) => e.interaction)
    const { events } = nft
    const owner = owners[nft.currentOwner] || newOwnerEntry()

    if (interactions.includes(Interaction.CONSUME)) {
      // no owner
      return
    }
    if (
      interactions.includes(Interaction.BUY) ||
      interactions.includes(Interaction.SEND)
    ) {
      // NFT changed hands
      const latestchangeHandsEvent = events.findLast(
        (event) =>
          event.interaction === Interaction.BUY ||
          event.interaction === Interaction.SEND
      )
      const lastestTimeStamp = new Date(
        latestchangeHandsEvent.timestamp
      ).getTime()

      owners[nft.currentOwner] = updateOwnerWithNewNft({
        owner,
        latestEvent: latestchangeHandsEvent,
        lastestTimeStamp,
        nft,
      })
      return
    }

    // nft isn't consumed and it hasn't change hands => it is owned by it's creator
    const mintInteraction = events[0]
    const mintTimeStamp = new Date(mintInteraction.timestamp).getTime()

    owners[nft.currentOwner] = updateOwnerWithNewNft({
      owner,
      latestEvent: mintInteraction,
      lastestTimeStamp: mintTimeStamp,
      nft,
    })
  })
  return owners
}

export const getFlippers = (interactions: InteractionWithNFT[]): Flippers => {
  const { NFTS, changeHandsInteractions } =
    preProccessForFindingFlippers(interactions)

  // Create an object that will hold all the flipper data
  const flippers: Flippers = {}

  // Loop through all the change hands interactions
  changeHandsInteractions.forEach((interaction) => {
    const nftId = interaction.nft.id
    const PreviousNFTState = NFTS[nftId]
    if (interaction.interaction === Interaction.SEND) {
      // NFT has been sent from one address to another
      PreviousNFTState.owner = interaction.meta
      PreviousNFTState.latestInteraction = Interaction.SEND
    }

    if (interaction.interaction === Interaction.BUY) {
      // Update the NFT state
      NFTS[nftId] = {
        ...PreviousNFTState,
        owner: interaction.caller,
        latestInteraction: Interaction.BUY,
        latestPrice: parseInt(interaction.meta),
      }
      if (PreviousNFTState.latestInteraction === Interaction.BUY) {
        // NFT has been bought, and previous interaction is also a buy => it's a Flip!
        const boughtPrice = getLatestPrice(PreviousNFTState)
        // Calculate profit
        const profit =
          boughtPrice > 0 ? (parseInt(interaction.meta) / boughtPrice) * 100 : 0

        // Create the new FlipEvent object
        const thisFlip = {
          nft: PreviousNFTState.nft,
          soldPrice: parseInt(interaction.meta),
          soldTo: interaction.caller,
          sellTimeStamp: new Date(interaction.timestamp).getTime(),
          boughtPrice,
          profit,
        }

        // Check if the previous owner is already a flipper, if not initialize them
        if (flippers[PreviousNFTState.owner] === undefined) {
          flippers[PreviousNFTState.owner] = flipperInitialState()
        }

        // Add the new FlipEvent to the previous owner's flips array
        flippers[PreviousNFTState.owner].flips.push(thisFlip)
      }
    }
  })

  Object.entries(flippers).forEach(([flipperId, { flips }]) => {
    flippers[flipperId] = summerizeFlips(flips)
  })
  return flippers
}
