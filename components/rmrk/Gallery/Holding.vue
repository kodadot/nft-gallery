<template>
  <Holder
    :events="ownerEventsOfNftCollection"
    group-key-option="CollectionId"
    openOnDefault
    date-header-label="Last Activity"
    name-header-label="Collection"
    hideCollapse />
</template>

<script lang="ts">
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Interaction } from '../service/scheme'
import allCollectionSaleEvents from '@/queries/rmrk/subsquid/allCollectionSaleEvents.graphql'
import collectionListByAccount from '@/queries/rmrk/subsquid/collectionListByAccount.graphql'
import { notificationTypes, showNotification } from '@/utils/notification'
import { sortedEventByDate } from '~/utils/sorting'

const components = {
  Holder: () => import('@/components/rmrk/Gallery/Holder/Holder.vue'),
}

@Component({ components })
export default class Holding extends mixins(PrefixMixin) {
  @Prop({ type: String, default: '' }) accountId: string
  private collectionIdList: string[] = []

  public ownerEventsOfNftCollection: Interaction[] | [] = []
  public totalCollections = 0

  async fetchHoldingInfo() {
    await this.fetchCollectionList()
    if (this.collectionIdList.length) {
      this.fetchCollectionEvents()
    }
  }

  private async fetchCollectionList() {
    const result = await this.$apollo.query({
      query: collectionListByAccount,
      client: this.urlPrefix === 'rmrk' ? 'subsquid' : this.urlPrefix,
      variables: {
        account: this.accountId,
        offset: 0,
      },
    })
    this.handleCollectionResult(result)
  }

  protected async handleCollectionResult({ data }: any) {
    if (data) {
      this.totalCollections = data.stats.totalCount
      this.collectionIdList = data.collectionEntities.map(
        (collection) => collection.id
      )
    }
    // in case user is only a collector, set tab to collected
    if (this.totalCollections === 0) {
      this.$router
        .replace({ query: { tab: 'collected' } })
        .catch(console.warn /*Navigation Duplicate err fix later */)
    }
  }

  protected async fetchCollectionEvents() {
    try {
      const { data } = await this.$apollo.query<{ events: Interaction[] }>({
        query: allCollectionSaleEvents,
        client: 'subsquid',
        variables: {
          ids: this.collectionIdList,
        },
      })
      if (data && data.events && data.events.length) {
        this.ownerEventsOfNftCollection = sortedEventByDate(data.events, 'ASC')
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  @Watch('accountId', { immediate: true })
  public watchAccountId(): void {
    if (this.accountId) {
      this.fetchHoldingInfo()
    }
  }
}
</script>
