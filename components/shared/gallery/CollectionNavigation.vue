<template>
  <Navigation
    v-if="isVisible"
    :showNavigation="showNavigation"
    :items="nftIdList"
    :currentId="nftId" />
</template>

<script lang="ts">
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import { mapToId } from '~/utils/mappers'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { notificationTypes, showNotification } from '~/utils/notification'
import resolveQueryPath from '~/utils/queryPathResolver'
import shouldUpdate from '~/utils/shouldUpdate'
import { unwrapSafe } from '~/utils/uniquery'

const components = {
  Navigation: () => import('@/components/rmrk/Gallery/Item/Navigation.vue'),
}

@Component({ components })
export default class CollectionNavigation extends mixins(PrefixMixin) {
  @Prop(String) public collectionId!: string
  @Prop(String) public nftId!: string
  @Prop(Boolean) public showNavigation!: boolean
  protected nftIdList: string[] = []

  @Watch('collectionId')
  public onCollectionIdChanged(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.fetchNftIdList()
    }
  }

  get isVisible() {
    return this.nftIdList.length > 1
  }

  protected async fetchNftIdList() {
    try {
      const query = await resolveQueryPath(
        this.urlPrefix,
        'nftIdListByCollection'
      )
      const nfts = await this.$apollo.query({
        query: query.default,
        client: this.urlPrefix,
        variables: {
          id: this.collectionId,
        },
      })

      const {
        data: { nftEntities },
      } = nfts

      this.nftIdList = unwrapSafe(nftEntities).map(mapToId) || []
      // this.$store.dispatch('history/setCurrentCollection', {
      //   id: collectionId,
      //   nftIds: this.nftsFromSameCollection,
      // })
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }
}
</script>
