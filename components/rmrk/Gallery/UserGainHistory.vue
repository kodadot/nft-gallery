<template>
  <Flipper
    :events="ownerEventsOfNft"
    group-key-option="CollectionId"
    name-header-label="Name" />
</template>

<script lang="ts">
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Interaction } from '../service/scheme'
import allNftSaleEventsHistoryByAccountId from '@/queries/rmrk/subsquid/allNftSaleEventsHistoryByAccountId.graphql'
import { notificationTypes, showNotification } from '@/utils/notification'
import { sortedEventByDate } from '~/utils/sorting'
import { NftHolderEvent } from '@/components/rmrk/Gallery/Holder/Holder.vue'

const components = {
  Flipper: () => import('@/components/rmrk/Gallery/Flipper.vue'),
}

@Component({ components })
export default class UserGainHistory extends mixins(PrefixMixin) {
  @Prop({ type: String, default: '' }) accountId!: string
  public ownerEventsOfNft: Interaction[] | [] = []

  protected async fetchNftEvents() {
    try {
      const { data } = await this.$apollo.query<{ events: NftHolderEvent[] }>({
        query: allNftSaleEventsHistoryByAccountId,
        client: this.client,
        variables: {
          id: this.accountId,
        },
      })

      if (data && data.events && data.events.length) {
        this.ownerEventsOfNft = sortedEventByDate(data.events, 'ASC')
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
