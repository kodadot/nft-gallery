<template>
  <Flipper
    :events="ownerEventsOfNft"
    group-key-option="CollectionId"
    name-header-label="Name" />
</template>

<script lang="ts" setup>
import { Interaction } from '../service/scheme'
import allNftSaleEventsHistoryByAccountId from '@/queries/rmrk/subsquid/allNftSaleEventsHistoryByAccountId.graphql'
import { sortedEventByDate } from '@/utils/sorting'

import Flipper from '@/components/rmrk/Gallery/Flipper.vue'

const props = defineProps({
  accountId: { type: String, default: '' },
})

const ownerEventsOfNft = ref<Interaction[] | []>([])
const { client } = usePrefix()

const { refresh } = useLazyAsyncData('ownerEventsOfNft', async () => {
  try {
    const { data } = await useAsyncQuery({
      query: allNftSaleEventsHistoryByAccountId,
      variables: { id: props.accountId },
      clientId: client.value,
    })

    if (data && data.value.events && data.value.events.length) {
      ownerEventsOfNft.value = sortedEventByDate(data.value.events, 'ASC')
    }
  } catch (e) {
    warningMessage(`${e}`)
  }
})

watch(
  () => props.accountId,
  () => {
    refresh()
  },
)
</script>
