<template>
  <CommonHolderTable
    :events="ownerEventsOfNft"
    group-key-option="CollectionId"
    open-on-default
    date-header-label="Last Activity"
    name-header-label="Collection"
    :collapse-title-option="$t('Holdings')"
    hide-collapse />
</template>

<script lang="ts" setup>
import { Interaction } from '../service/scheme'
import allNftSaleEventsByAccountId from '@/queries/rmrk/subsquid/allNftSaleEventsByAccountId.graphql'
import { notificationTypes, showNotification } from '@/utils/notification'
import { sortedEventByDate } from '@/utils/sorting'
import CommonHolderTable, {
  NftHolderEvent,
} from '@/components/rmrk/Gallery/Holder/Holder.vue'

const props = defineProps({
  accountId: { type: String, default: '' },
})

const ownerEventsOfNft = ref<Interaction[] | []>([])

const { refresh } = useLazyAsyncData('ownerEventsOfNft', async () => {
  try {
    const { data } = await useAsyncQuery(allNftSaleEventsByAccountId, {
      id: props.accountId,
    })
    if (data && data.nftEntities && data.nftEntities.length) {
      const events: NftHolderEvent[] = []
      data.nftEntities.forEach((item) => {
        const nftEvents = item.events.map((event: Interaction) => ({
          ...event,
          nft: {
            id: item.id,
            name: item.name,
            collection: item.collection,
          },
        }))
        events.push(...nftEvents)
      })
      ownerEventsOfNft.value = sortedEventByDate(events, 'ASC')
    }
  } catch (e) {
    showNotification(`${e}`, notificationTypes.warn)
  }
})

watch(
  () => props.accountId,
  () => {
    refresh()
  },
)
</script>
