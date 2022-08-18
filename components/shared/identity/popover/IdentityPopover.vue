<template>
  <v-tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    placement="bottom"
    :delay="[100, 800]"
    data-cy="identity">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <div class="popover-content-container p-4 ms-dos-shadow">
      <IdentityPopoverHeader
        :identity="identity"
        :address="shortenedAddress"
        :started-minting="startedMinting"
        :last-bought="lastBought"
        :total-collected="totalCollected"
        :total-created="totalCreated" />
      <hr style="height: 1px" class="m-0" />
      <IdentityPopoverFooter
        :total-collected="totalCollected"
        :total-created="totalCreated"
        :total-sold="totalSold" />
    </div>
  </v-tippy>
</template>

<script lang="ts" setup>
import { isAfter, subHours } from 'date-fns'

import { notificationTypes, showNotification } from '@/utils/notification'
import { formatToNow } from '@/utils/format/time'
import resolveQueryPath from '@/utils/queryPathResolver'
import shortAddress from '@/utils/shortAddress'

import { Interaction } from '@/components/rmrk/service/scheme'

import usePrefix from '@/composables/usePrefix'

type IdentityFields = { [key: string]: string }

const IdentityPopoverHeader = defineAsyncComponent(
  () => import('@/components/shared/identity/popover/IdentityPopoverHeader.vue')
)
const IdentityPopoverFooter = defineAsyncComponent(
  () => import('@/components/shared/identity/popover/IdentityPopoverFooter.vue')
)

const props = defineProps<{
  identity?: IdentityFields
}>()

const { $apollo, $consola, $store } = useNuxtApp()
const { client } = usePrefix()

const totalCreated = ref(0)
const totalCollected = ref(0)
const totalSold = ref(0)
const firstMintDate = ref(new Date())
const lastBoughtDate = ref(new Date())

const address = computed(() => props.identity?.address || '')
const shortenedAddress = computed(() => shortAddress(address.value))
const startedMinting = computed(() => formatToNow(firstMintDate.value))
const lastBought = computed(() => formatToNow(lastBoughtDate.value))

onMounted(() => {
  fetchLastBought()
  fetchNFTStats()
})

const fetchLastBought = async () => {
  if (!address) {
    return
  }

  try {
    const query = await resolveQueryPath(client.value, 'buyEventByProfile')
    const { data } = await $apollo.query<{ events: Interaction[] }>({
      query: query.default,
      client: client.value,
      variables: {
        id: address.value,
      },
    })

    if (data.events.length) {
      lastBoughtDate.value = new Date(data.events[0].timestamp)
    }
  } catch (error) {
    showNotification(`${error}`, notificationTypes.danger)
    $consola.error(error)
  }
}

const fetchNFTStats = async () => {
  if (!address) {
    return
  }

  try {
    const data = $store.getters['identityMint/getIdentityMintFor'](
      address.value
    )

    // if cache exist and within 12h
    if (data?.updatedAt && isAfter(data.updatedAt, subHours(Date.now(), 12))) {
      handleNFTStats({ data, type: 'cache' })
    } else {
      const query = await resolveQueryPath(client.value, 'userStatsByAccount')
      const { data: account } = await $apollo.query({
        query: query.default,
        client: client.value,
        variables: {
          account: address.value,
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
  totalCreated.value = data.created.totalCount
  totalCollected.value = data.collected.totalCount
  totalSold.value = data.sold.totalCount

  if (type === 'cache') {
    firstMintDate.value = data.firstMintDate
  } else {
    if (data.firstMint?.length > 0) {
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
      address: address.value,
      cacheData,
    })
  }
}

watch(address, () => {
  fetchLastBought()
  fetchNFTStats()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.tippy-container {
  display: inline-block;
}

.popover-content-container {
  border: 2px solid $primary;
  max-width: 350px;
}

.ms-dos-shadow {
  box-shadow: $dropdown-content-shadow;
}
</style>
