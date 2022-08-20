import { isAfter, subHours } from 'date-fns'

import useGraphql from '@/composables/useGraphql'

import { formatToNow } from '@/utils/format/time'
import { Interaction } from '@/components/rmrk/service/scheme'

const useLastBought = ({ address }) => {
  const lastBoughtDate = ref(new Date())

  const { data } = useGraphql({
    queryname: 'buyEventByProfile',
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

export default function useIdentityStats({ address }) {
  const { $store } = useNuxtApp()

  const totalCollected = ref(0)
  const totalCreated = ref(0)
  const totalSold = ref(0)
  const firstMintDate = ref(new Date())

  const { lastBoughtDate } = useLastBought({ address })
  const { data: stats } = useGraphql({
    queryname: 'userStatsByAccount',
    variables: {
      account: address || '',
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

    const cacheData = {
      created: {
        totalCount: totalCreated.value,
      },
      collected: {
        totalCount: totalCollected.value,
      },
      sold: {
        totalCount: totalSold.value,
      },
      firstMintDate: data?.firstMint[0]?.createdAt,
      updatedAt: Date.now(),
    }

    await $store.dispatch('identityMint/setIdentity', {
      address: address,
      cacheData,
    })
  }

  const fetchNFTStats = () => {
    if (!address || !stats.value) {
      return
    }

    // if cache exist and within 12h
    const data = $store.getters['identityMint/getIdentityMintFor'](address)
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
