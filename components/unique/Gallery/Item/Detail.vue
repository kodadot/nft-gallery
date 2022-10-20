<template>
  <div v-if="detailVisible">
    <p class="label">
      {{ $t('collection') }}
    </p>
    <p class="subtitle is-size-6">
      <nuxt-link
        v-if="nft.collection"
        v-show="!isLoading"
        :to="`/${urlPrefix}/collection/${
          nft.collectionId || nft.collection.id
        }`"
        data-cy="item-collection">
        {{ nft.collection.name }}
      </nuxt-link>
      <b-skeleton :active="isLoading"></b-skeleton>
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
    <b-skeleton :active="isLoading"></b-skeleton>
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
      <b-skeleton :active="isLoading"></b-skeleton>
    </template>
    <template v-if="nft.delegate">
      <p class="label">
        {{ $t('delegate') }}
        <span>
          <a class="has-text-danger"><b-icon icon="times"> </b-icon></a>
        </span>
      </p>
      <p class="subtitle is-size-6">
        <ProfileLink
          data-cy="item-delegate"
          :address="nft.delegate"
          show-twitter />
        <b-skeleton :active="isLoading"></b-skeleton>
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

const components = {
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
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
