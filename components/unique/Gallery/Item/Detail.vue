<template>
  <div v-if="detailVisible">
    <p class="label">
      {{ $t('collection') }}
    </p>
    <p class="subtitle is-size-6">
      <CollectionDetailsPopover
        v-if="nft.collection"
        v-show="!isLoading"
        :nft="nft">
        <template #trigger>
          <nuxt-link
            v-if="nft.collection"
            v-show="!isLoading"
            :to="`/${urlPrefix}/collection/${
              nft.collectionId || nft.collection.id
            }`"
            data-cy="item-collection">
            {{ nft.collection.name }}
          </nuxt-link>
        </template>
      </CollectionDetailsPopover>
      <NeoSkeleton :active="isLoading"></NeoSkeleton>
    </p>
    <p class="label">
      {{ $t('creator') }}
    </p>
    <p v-show="!isLoading" class="subtitle is-size-6">
      <ProfileLink
        data-cy="item-creator"
        :address="nft.issuer"
        show-twitter
        show-discord />
    </p>
    <NeoSkeleton :active="isLoading"></NeoSkeleton>
    <template v-if="nft.issuer !== nft.currentOwner">
      <p class="label">
        {{ $t('owner') }}
      </p>
      <p v-show="!isLoading" class="subtitle is-size-6">
        <ProfileLink
          data-cy="item-owner"
          :address="nft.currentOwner"
          show-twitter
          show-discord />
      </p>
      <NeoSkeleton :active="isLoading"></NeoSkeleton>
    </template>
    <template v-if="nft.delegate">
      <p class="label">
        {{ $t('delegate') }}
        <span>
          <a class="has-text-danger"><NeoIcon icon="times"> </NeoIcon></a>
        </span>
      </p>
      <p class="subtitle is-size-6">
        <ProfileLink
          data-cy="item-delegate"
          :address="nft.delegate"
          show-twitter />
        <NeoSkeleton :active="isLoading"></NeoSkeleton>
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'

import { NFTWithMeta } from '@/components/rmrk/service/scheme'

import PrefixMixin from '@/utils/mixins/prefixMixin'
import { emptyObject } from '@/utils/empty'
import isShareMode from '@/utils/isShareMode'
import { NeoSkeleton } from '@kodadot1/brick'
import { NeoIcon } from '@kodadot1/brick'

const components = {
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  CollectionDetailsPopover: () =>
    import(
      '@/components/collectionDetailsPopover/CollectionDetailsPopover.vue'
    ),
  NeoSkeleton,
  NeoIcon,
}

@Component({ components })
export default class GalleryItemDetail extends mixins(PrefixMixin) {
  @Prop({ default: () => emptyObject<NFTWithMeta>() }) public nft!: NFTWithMeta
  @Prop() public isLoading!: boolean

  get detailVisible() {
    return !isShareMode
  }

  get carbonlessBadge() {
    return this.nft.attributes?.some(
      ({ trait_type, value }) => trait_type === 'carbonless' && value
    )
  }
}
</script>
