<template>
  <Holder
    :events="ownerEventsOfNft"
    group-key-option="CollectionId"
    openOnDefault
    date-header-label="Last Activity"
    name-header-label="Collection"
    :collapseTitleOption="$t('Holdings')"
    hideCollapse />
</template>

<script lang="ts">
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Interaction } from '../service/scheme'
import allCollectionSaleEvents from '@/queries/rmrk/subsquid/allCollectionSaleEvents.graphql'
import { notificationTypes, showNotification } from '@/utils/notification'
import { sortedEventByDate } from '~/utils/sorting'
import nftListOwned from '@/queries/nftListOwned.graphql'
import type { Instance } from '@/components/unique/types.ts'

const components = {
  Holder: () => import('@/components/rmrk/Gallery/Holder/Holder.vue'),
}

@Component({ components })
export default class Holding extends mixins(PrefixMixin) {
  @Prop({ type: String, default: '' }) accountId: string
  private collectionIdList: string[] = []

  public ownerEventsOfNft: Interaction[] | [] = []

  async fetchNftListOwned() {
    this.$apollo.addSmartQuery('items', {
      query: nftListOwned,
      manual: true,
      client: this.urlPrefix,
      update: ({ nFTEntities }) => nFTEntities.nodes,
      loadingKey: 'isLoading',
      result: this.handleNftListResult,
      variables: () => {
        return {
          account: this.accountId,
          offset: 0,
        }
      },
      fetchPolicy: 'cache-and-network',
    })
  }

  protected async handleNftListResult({ data }: any) {
    if (data && data.nFTEntities) {
      const collectionIdSet = new Set<string>()
      data.nFTEntities.nodes.forEach((item: Instance) => {
        collectionIdSet.add(item.collectionId)
      })
      this.collectionIdList = Array.from(collectionIdSet)
      if (this.collectionIdList.length) {
        this.fetchCollectionEvents()
      }
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
        this.ownerEventsOfNft = sortedEventByDate(data.events, 'ASC')
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  @Watch('accountId', { immediate: true })
  public watchAccountId(): void {
    if (this.accountId) {
      this.fetchNftListOwned()
    }
  }
}
</script>
