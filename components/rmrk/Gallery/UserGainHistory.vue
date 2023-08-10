<template>
  <Flipper
    :events="ownerEventsOfNft"
    group-key-option="CollectionId"
    name-header-label="Name" />
</template>

<script lang="ts" setup>
import { Interaction } from '../service/scheme'
import allNftSaleEventsHistoryByAccountId from '@/queries/rmrk/subsquid/allNftSaleEventsHistoryByAccountId.graphql'
import { notificationTypes, showNotification } from '@/utils/notification'
import { sortedEventByDate } from '@/utils/sorting'
import { NftHolderEvent } from '@/components/rmrk/Gallery/Holder/Holder.vue'

import Flipper from '@/components/rmrk/Gallery/Flipper.vue'

const props = defineProps({
  accountId: { type: String, default: '' },
})

const ownerEventsOfNft = ref<Interaction[] | []>([])
const { $apollo } = useNuxtApp()
const { client } = usePrefix()

const { refresh } = useLazyAsyncData('ownerEventsOfNft', async () => {
  try {
    const { data } = await $apollo.query<{ events: NftHolderEvent[] }>({
      query: allNftSaleEventsHistoryByAccountId,
      client: client.value,
      variables: {
        id: props.accountId,
      },
    })

    if (data && data.events && data.events.length) {
      ownerEventsOfNft.value = sortedEventByDate(data.events, 'ASC')
    }
  } catch (e) {
    showNotification(`${e}`, notificationTypes.warn)
  }
})

watch(
  () => props.accountId,
  () => {
    refresh()
  }
)
</script>
