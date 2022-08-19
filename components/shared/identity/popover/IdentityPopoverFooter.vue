<template>
  <div class="popover-stats-container pt-3">
    <div class="has-text-centered">
      <p class="has-text-weight-bold is-size-6">{{ totalCollected }}</p>
      <span class="is-size-7 is-uppercase">{{ $t('profile.collected') }}</span>
    </div>
    <div class="has-text-centered">
      <p class="has-text-weight-bold is-size-6">{{ totalCreated }}</p>
      <span class="is-size-7 is-uppercase">{{ $t('profile.created') }}</span>
    </div>
    <div class="has-text-centered">
      <p class="has-text-weight-bold is-size-6">{{ totalSold }}</p>
      <span class="is-size-7 is-uppercase">{{ $t('profile.sold') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isAfter, subHours } from 'date-fns'

import usePrefix from '@/composables/usePrefix'
import { notificationTypes, showNotification } from '@/utils/notification'
import resolveQueryPath from '@/utils/queryPathResolver'

const { $apollo, $consola, $store } = useNuxtApp()
const { client } = usePrefix()

const totalSold = ref(0)
const totalCreated = inject('totalCreated', ref(0))
const totalCollected = inject('totalCollected', ref(0))

const address = inject('address')
const firstMintDate = inject('firstMintDate', ref(new Date()))

onMounted(() => {
  fetchNFTStats()
})

const fetchNFTStats = async () => {
  if (!address) {
    return
  }

  try {
    const data = $store.getters['identityMint/getIdentityMintFor'](address)

    // if cache exist and within 12h
    if (data?.updatedAt && isAfter(data.updatedAt, subHours(Date.now(), 12))) {
      handleNFTStats({ data, type: 'cache' })
    } else {
      const query = await resolveQueryPath(client.value, 'userStatsByAccount')
      const { data: account } = await $apollo.query({
        query: query.default,
        client: client.value,
        variables: {
          account: address,
        },
      })
      handleNFTStats({ data: account, type: 'fresh' })
    }
  } catch (error) {
    showNotification(`${error}`, notificationTypes.danger)
    $consola.error(error)
  }
}

const handleNFTStats = async ({ data, type }) => {
  totalCreated.value = data.created?.totalCount || data.totalCreated || 0
  totalCollected.value = data.collected?.totalCount || data.totalCollected || 0
  totalSold.value = data.sold?.totalCount || data.totalSold || 0

  if (type === 'cache') {
    firstMintDate.value = data.firstMintDate
  } else {
    if (data.firstMint?.length > 0) {
      firstMintDate.value = data.firstMint[0].createdAt
    }

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
      firstMintDate: firstMintDate.value,
      updatedAt: Date.now(),
    }

    await $store.dispatch('identityMint/setIdentity', {
      address: address,
      cacheData,
    })
  }
}
</script>

<style>
.popover-stats-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>
