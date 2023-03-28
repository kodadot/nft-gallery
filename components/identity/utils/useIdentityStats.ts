import { isAfter, subHours } from 'date-fns'

import { useIdentityMintStore } from '@/stores/identityMint'
import { formatToNow } from '@/utils/format/time'
import { Interaction } from '@/components/rmrk/service/scheme'

const useLastBought = ({ address }) => {
  const lastBoughtDate = ref(new Date())

  const { data } = useGraphql({
    queryName: 'buyEventByProfile',
    variables: {
      id: address,
    },
  })

  const fetchLastBought = () => {
    const dataLastBought = data.value as unknown as { events: Interaction[] }

    if (!address && !data.value) {
      return
    }

    if (dataLastBought?.events?.length) {
      lastBoughtDate.value = new Date(dataLastBought.events[0].timestamp)
    }
  }

  watch(data, fetchLastBought)

  return {
    lastBoughtDate,
  }
}

const whichData = ({ data, type }) => {
  const totalCount = {
    created: data?.created?.totalCount || data?.totalCreated,
    collected: data?.collected?.totalCount || data?.totalCollected,
    sold: data?.sold?.totalCount || data?.totalSold,
  }

  return totalCount[type] || 0
}

const cacheTotalCount = ({ data, totalCreated, totalCollected, totalSold }) => {
  const cacheData = {
    created: {
      totalCount: totalCreated,
    },
    collected: {
      totalCount: totalCollected,
    },
    sold: {
      totalCount: totalSold,
    },
    firstMintDate: data?.firstMint[0]?.createdAt || new Date(),
    updatedAt: Date.now(),
  }

  return cacheData
}

export default function useIdentityStats({ address }) {
  const identityMintStore = useIdentityMintStore()

  const totalCollected = ref(0)
  const totalCreated = ref(0)
  const totalSold = ref(0)
  const firstMintDate = ref(new Date())

  const { lastBoughtDate } = useLastBought({ address })
  const { data: stats } = useGraphql({
    queryName: 'userStatsByAccount',
    variables: {
      account: address,
    },
  })

  const startedMinting = computed(() => formatToNow(firstMintDate.value))
  const lastBought = computed(() => formatToNow(lastBoughtDate.value))

  const handleNFTStats = async ({ data, type }) => {
    totalCreated.value = whichData({ data, type: 'created' })
    totalCollected.value = whichData({ data, type: 'collected' })
    totalSold.value = whichData({ data, type: 'sold' })

    if (type === 'cache') {
      firstMintDate.value = data.firstMintDate
      return
    }

    const cacheData = cacheTotalCount({
      data,
      totalCreated: totalCreated.value,
      totalCollected: totalCollected.value,
      totalSold: totalSold.value,
    })

    firstMintDate.value = cacheData.firstMintDate

    identityMintStore.setIdentity({
      address,
      cacheData,
    })
  }

  const fetchNFTStats = () => {
    // if cache exist and within 12h
    const data = identityMintStore.getIdentityMintFor(address)
    if (data?.updatedAt && isAfter(data.updatedAt, subHours(Date.now(), 12))) {
      return handleNFTStats({ data, type: 'cache' })
    }

    return handleNFTStats({ data: stats.value, type: 'fresh' })
  }

  watch(stats, fetchNFTStats)

  return {
    totalCollected,
    totalCreated,
    totalSold,
    lastBought,
    startedMinting,
  }
}
