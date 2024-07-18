import { isAfter, subHours } from 'date-fns'

import { useIdentityMintStore } from '@/stores/identityMint'
import { formatToNow } from '@/utils/format/time'
import buyEventByProfile from '@/queries/subsquid/general/buyEventByProfile.query'

const useLastBought = ({ address }: { address: Ref<string> }) => {
  const lastBoughtDate = ref(new Date())

  const { data } = useAsyncQuery({
    query: buyEventByProfile,
    variables: {
      id: address.value,
    },
  })

  const fetchLastBought = () => {
    const dataLastBought = data.value

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

const cacheTotalCount = ({ data, totalCreated }) => {
  const cacheData = {
    created: {
      totalCount: totalCreated,
    },
    firstMintDate: data?.value?.firstMint[0]?.createdAt || new Date(),
    updatedAt: Date.now(),
  }

  return cacheData
}

export default function useIdentityStats({
  address,
}: {
  address: Ref<string>
}) {
  const identityMintStore = useIdentityMintStore()

  const totalCreated = ref(0)
  const firstMintDate = ref(new Date())

  const { lastBoughtDate } = useLastBought({ address })
  const { data: stats } = useGraphql({
    queryName: 'userStatsByAccount',
    variables: {
      account: address.value,
    },
  })

  const startedMinting = computed(() => formatToNow(firstMintDate.value))
  const lastBought = computed(() => formatToNow(lastBoughtDate.value))

  const handleNFTStats = ({ data, type }) => {
    totalCreated.value = whichData({ data, type: 'created' })

    if (type === 'cache') {
      firstMintDate.value = data.firstMintDate
      return
    }

    const cacheData = cacheTotalCount({
      data,
      totalCreated: totalCreated.value,
    })

    firstMintDate.value = cacheData.firstMintDate

    identityMintStore.setIdentity({
      address: address.value,
      cacheData,
    })
  }

  const fetchNFTStats = () => {
    // if cache exist and within 12h
    const data = identityMintStore.getIdentityMintFor(address.value)
    if (data?.updatedAt && isAfter(data.updatedAt, subHours(Date.now(), 12))) {
      return handleNFTStats({ data, type: 'cache' })
    }

    return handleNFTStats({ data: stats.value, type: 'fresh' })
  }

  watch(stats, fetchNFTStats)

  return {
    totalCreated,
    lastBought,
    startedMinting,
  }
}
