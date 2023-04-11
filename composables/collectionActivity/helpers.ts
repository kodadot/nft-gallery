import { Interaction } from '@kodadot1/minimark'
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

const flipperInitialValue = {
  flips: [],
  bestFlip: 0,
  latestflipTimestamp: 0,
  owned: 0,
  totalBought: 0,
  totalsold: 0,
}

const newOwnerEntry = (lastActivityTimestamp, nft) => ({
  nftCount: 1,
  totalBought: 0,
  totalSold: 0,
  lastActivityTimestamp,
  nfts: [nft],
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

export const getFlippers = (interactions: InteractionWithNFT[]): Flippers => {
  const { NFTS, changeHandsInteractions } =
    preProccessForFindingFlippers(interactions)

  // Create an object that will hold all the flipper data
  const flippers: Flippers = {}

  // Loop through all the change hands interactions
  changeHandsInteractions.forEach((interaction) => {
    if (interaction.interaction === Interaction.SEND) {
      // NFT has been sent from one address to another
      NFTS[interaction.nft.id].owner = interaction.meta
      NFTS[interaction.nft.id].latestInteraction = Interaction.SEND
    }
    if (interaction.interaction === Interaction.BUY) {
      // NFT has been bought, it's a Flip!

      const nftId = interaction.nft.id
      const PreviousNFTState = NFTS[nftId]
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
        flippers[PreviousNFTState.owner] = flipperInitialValue
      }

      // Add the new FlipEvent to the previous owner's flips array
      flippers[PreviousNFTState.owner].flips.push(thisFlip)

      // Update the NFT state
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
