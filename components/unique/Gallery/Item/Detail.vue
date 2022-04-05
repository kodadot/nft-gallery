<template>
  <div v-if="detailVisible">
    <p class="label">
      {{ $t('collection') }}
    </p>
    <p class="subtitle is-size-6">
      <nuxt-link
        v-if="nft.collection"
        :to="`/${urlPrefix}/collection/${nft.collectionId}`"
        v-show="!isLoading">
        {{ nft.collection.name }}
      </nuxt-link>
      <b-skeleton :active="isLoading"></b-skeleton>
    </p>
    <p class="label">
      {{ $t('creator') }}
    </p>
    <p class="subtitle is-size-6" v-show="!isLoading">
      <ProfileLink :address="nft.issuer" showTwitter showDiscord />
    </p>
    <b-skeleton :active="isLoading"></b-skeleton>
    <template v-if="nft.issuer !== nft.currentOwner">
      <p class="label">
        {{ $t('owner') }}
      </p>
      <p class="subtitle is-size-6" v-show="!isLoading">
        <ProfileLink :address="nft.currentOwner" showTwitter showDiscord />
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
        <ProfileLink :address="nft.delegate" showTwitter />
        <b-skeleton :active="isLoading"></b-skeleton>
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import isShareMode from '@/utils/isShareMode'
import { NFTWithMeta } from '@/components/rmrk/service/scheme'
import { emptyObject } from '@/utils/empty'
import PrefixMixin from '~/utils/mixins/prefixMixin'

const components = {
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
}

@Component({ components })
export default class Name extends mixins(PrefixMixin) {
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
