import type { SomethingWithMeta } from '@/utils/ipfs'
import type { CarouselNFT } from '@/components/base/types'

import { sanitizeIpfsUrl } from '@/utils/ipfs'

// import collectionCuratedList from '@/queries/subsquid/general/collectionCuratedList.graphql'
// import collectionLastList from '@/queries/subsquid/general/collectionLastList.graphql'

const curatedCollection = {
  bsx: [
    '1865909717', // 'Berliner'
    '21032023', // 'Spring Waifus 🐞
    '2551182625', // Luna Witches (deepologics)
    '2608295324', // Deity
    '3579963603', // Hooker's Urban
    '945672150', // NAGA KADAL
    '1825819407', // KoDragons
    '1635680444', // KODACHAINS
  ],
  rmrk: [
    '900D19DC7D3C444E4C-MECHWOM', // Mechanical Woman (deepologics)
    '4A43156FE23E061C03-SNK', // Snek-Frens
    '08C79124CAC59DC643-BOREDBARRO', // BOREDBARRO
    '160a6f4320f11acb25-LCKWV', // PixelBabe
    '800f8a914281765a7d-KITTY', // Kitty
    '0a24c7876a892acb79-RADTOADZ', // RadToadz (ZestLifeLab)
    // '8adee5c0c132c32e6a-🎵QMB🎵', // 🎵Quakz Music Box🎵
    // '2075be44ea4b9e422d-🐺', // WolfAngryClub
    // '7cf9daa38281a57331-BSS', // Spaceships (ClownWorldHouse)
  ],
  ksm: [
    '3629a3ff458d113e25-PUNK', // RMRK Punks
    '3e6f301b0a0b1a0e4e-MRWH', // Mr Whitehole
    '2644199cf3652aaa78-KK01', // Kusama Kings
    'be15890524c6e9b359-WIZARD', // Manta Wizard
    'e63e926f7db5997e5c-STGR', // STARGAZER
    'b45943b4edbf6f5c0f-SKYLAB_ARTEMIS_R4VENS', // The Artemis Project - Code R4VEN
    '22708b368d163c8007-CITY', // The City
    '7092505797a30ccf48-NEON BABES', // Neon Babes
    'B9F14D738824A41D42-TOKUNFT', // Toku NFT
  ],
  ahk: [
    '150', // MyGenArt
    '134', // Rad Panda
    '132', // Experience the scenic canyon drive
    '136', // Emotional Devastation
    '148', // threads (koda)
    '138', // Season 23
    '131', // Forgive me not
  ],
}

type Collections = CarouselNFT & SomethingWithMeta

const useSpotlightNft = () => useState<Collections[]>('nfts', () => [])

function updateCollections(data) {
  const collections = useSpotlightNft()

  if (!data?.collectionEntities?.length) {
    return
  }

  collections.value = data.collectionEntities.map((e) => ({
    ...e,
    metadata: e.meta?.id || e.metadata,
    image: (e.meta?.image && sanitizeIpfsUrl(e.meta?.image)) || '',
  })) as Collections[]
}

export default function useCarouselSpotlight() {
  const collections = useSpotlightNft()
  const { urlPrefix } = usePrefix()
  const variables = curatedCollection[urlPrefix.value]?.length
    ? { list: curatedCollection[urlPrefix.value] }
    : undefined
  const { data } = useGraphql({
    queryName: curatedCollection[urlPrefix.value]?.length
      ? 'collectionCuratedList'
      : 'collectionLastList',
    queryPrefix: urlPrefix.value,
    variables,
  })

  watch(data, () => {
    updateCollections(data.value)
  })

  return {
    collections: computed(() => collections.value),
    data,
  }
}
