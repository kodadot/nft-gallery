import { hexToString, isHex } from '@polkadot/util'

import { emptyObject } from '@/utils/empty'
import shortAddress from '@/utils/shortAddress'

import type { NFT } from '@/components/rmrk/service/scheme'

type IdentityFields = Record<string, string>

const handleRaw = (display): string => {
  if (display?.isRaw) {
    return display.asRaw.toHuman() as string
  }

  if (isHex(display?.Raw)) {
    return hexToString(display?.Raw)
  }

  return display?.toString()
}

const fetchIdentity = async (address: string): Promise<IdentityFields> => {
  if (!address) {
    return emptyObject<IdentityFields>()
  }

  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const optionIdentity = await api?.query.identity?.identityOf(address)
  const identityFresh = optionIdentity?.unwrapOrDefault()

  if (!identityFresh?.size) {
    return emptyObject<IdentityFields>()
  }

  const final = Array.from(identityFresh.info)
    .filter(([, value]) => !Array.isArray(value) && !value.isEmpty)
    .reduce((acc, [key, value]) => {
      acc[key] = handleRaw(value)
      return acc
    }, {} as IdentityFields)

  return final
}

const displayName = ({
  customNameOption,
  identity,
  shortenedAddress,
}): string => {
  if (customNameOption) {
    return customNameOption
  }

  const display = identity.value.display
  if (display?.length > 20) {
    return shortAddress(display)
  }

  return display || shortenedAddress.value
}

export default function useIdentity({
  address: initAddress,
  customNameOption = '',
}) {
  const address = ref(initAddress)
  const identity = ref<IdentityFields>({})
  const isFetchingIdentity = ref(false)
  const shortenedAddress = computed(() => shortAddress(address.value))
  const twitter = computed(() => identity?.value?.twitter)
  const discord = computed(() => identity?.value?.discord)
  const instagram = computed(() => identity?.value?.instagram)
  const display = computed(() => identity?.value?.display)
  const name = computed(() =>
    displayName({ customNameOption, identity, shortenedAddress })
  )

  const whichIdentity = async (addr: string) => {
    isFetchingIdentity.value = true

    // better if get data from indexer
    // reference: https://github.com/kodadot/nft-gallery/issues/3783
    identity.value = await fetchIdentity(addr)
    isFetchingIdentity.value = false
    address.value = addr
  }

  onMounted(() => address.value && whichIdentity(address.value))

  return {
    identity,
    isFetchingIdentity,
    shortenedAddress,
    twitter,
    discord,
    instagram,
    display,
    name,
    whichIdentity,
  }
}

export interface NFTListSold {
  nftEntities?: NFT[]
  nftEntitiesConnection: {
    totalCount: number
  }
}

export function useIdentitySoldData({ address }, collectionId?) {
  const nftEntities = ref<NFT[]>([])
  let collectionObject = {}
  if (collectionId) {
    collectionObject = {
      collectionId,
      where: {
        collection: { id_eq: collectionId },
      },
    }
  }

  const { data } = useGraphql({
    queryName: 'nftListSold',
    variables: {
      account: address,
      limit: 3,
      orderBy: 'price_DESC',
      ...collectionObject,
    },
  })

  watch(data as unknown as NFTListSold, (list) => {
    if (list.nftEntities?.length) {
      nftEntities.value = list.nftEntities
    }
  })

  return { nftEntities }
}
