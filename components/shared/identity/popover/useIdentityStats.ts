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

  const fetchLastBought = async () => {
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

export default function useNFTStats({ address }) {
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

  const fetchNFTStats = async () => {
    if (!address || !stats.value) {
      return
    }

    const data = $store.getters['identityMint/getIdentityMintFor'](address)

    // if cache exist and within 12h
    if (data?.updatedAt && isAfter(data.updatedAt, subHours(Date.now(), 12))) {
      handleNFTStats({ data, type: 'cache' })
    } else {
      handleNFTStats({ data: stats.value, type: 'fresh' })
    }
  }

  const handleNFTStats = async ({ data, type }) => {
    totalCreated.value = data?.created?.totalCount || data?.totalCreated || 0
    totalCollected.value =
      data?.collected?.totalCount || data?.totalCollected || 0
    totalSold.value = data?.sold?.totalCount || data?.totalSold || 0

    if (type === 'cache') {
      firstMintDate.value = data.firstMintDate
    } else {
      if (data?.firstMint?.length > 0) {
        firstMintDate.value = data.firstMint[0].createdAt
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
        firstMintDate: firstMintDate.value,
        updatedAt: Date.now(),
      }

      await $store.dispatch('identityMint/setIdentity', {
        address: address,
        cacheData,
      })
    }
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
