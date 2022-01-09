<template>
  <div v-if="detailVisible">
    <p class="label">
      {{ $t('collection') }}
    </p>
    <p class="subtitle is-size-6">
      <nuxt-link :to="{ name: 'rmrk-collection-id', params: { id: nft.collectionId } }">
        {{ nft.collectionId }}
      </nuxt-link>
      <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
    </p>
    <p class="label">
      {{ $t('creator') }}
    </p>
    <p class="subtitle is-size-6">
      <ProfileLink :address="nft.issuer" :showTwitter="true" showDiscord/>
      <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
      <!-- <a :href="`https://kusama.subscan.io/account/${nft.currentOwner}`" target="_blank"><Identity :address="nft.currentOwner" /></a> -->
    </p>
    <template v-if="nft.issuer !== nft.currentOwner">
      <p class="label">
        {{ $t('owner') }}
      </p>
      <p class="subtitle is-size-6">
        <ProfileLink :address="nft.currentOwner" :showTwitter="true" showDiscord/>
        <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
        <!-- <a :href="`https://kusama.subscan.io/account/${nft.currentOwner}`" target="_blank"><Identity :address="nft.currentOwner" /></a> -->
      </p>
    </template>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import isShareMode from '@/utils/isShareMode'
import { NFTWithMeta } from '../../service/scheme'
import { emptyObject } from '@/utils/empty'
// import Identity from '@/components/shared/format/Identity.vue'

const components = {
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue')
}

@Component({ components })
export default class Name extends Vue {
  @Prop({ default: () => emptyObject<NFTWithMeta>() }) public nft!: NFTWithMeta
  @Prop() public isLoading!: boolean

  get detailVisible() {
    return !isShareMode
  }

  get carbonlessBadge() {
    return this.nft.attributes?.some(({trait_type, value}) => trait_type === 'carbonless' && value)
  }
}
</script>
