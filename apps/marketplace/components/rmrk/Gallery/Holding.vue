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

<script lang="ts">
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Interaction, NftEvents } from '../service/scheme'
import allNftSaleEventsByAccountId from '@/queries/rmrk/subsquid/allNftSaleEventsByAccountId.graphql'
import { notificationTypes, showNotification } from '@/utils/notification'
import { sortedEventByDate } from '~/utils/sorting'
import { NftHolderEvent } from '@/components/rmrk/Gallery/Holder/Holder.vue'

const components = {
  CommonHolderTable: () =>
    import('@/components/rmrk/Gallery/Holder/Holder.vue'),
}

@Component({ components })
export default class Holding extends mixins(PrefixMixin) {
  @Prop({ type: String, default: '' }) accountId!: string
  public ownerEventsOfNft: Interaction[] | [] = []

  protected async fetchNftEvents() {
    try {
      const { data } = await this.$apollo.query<NftEvents>({
        query: allNftSaleEventsByAccountId,
        client: this.client,
        variables: {
          id: this.accountId,
        },
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
        this.ownerEventsOfNft = sortedEventByDate(events, 'ASC')
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  @Watch('accountId', { immediate: true })
  public watchAccountId(): void {
    if (this.accountId) {
      this.fetchNftEvents()
    }
  }
}
</script>
