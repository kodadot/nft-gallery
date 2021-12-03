<template>
  <div v-if="detailVisible">
    <p class="label">
      {{ $t('collection') }}
    </p>
    <p class="subtitle is-size-6">
      <router-link
        :to="{ name: 'collectionDetail', params: { id: nft.collectionId } }"
      >
        {{ nft.collectionId }}
      </router-link>
      <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
    </p>
    <p class="label">
      {{ $t('creator') }}
    </p>
    <p class="subtitle is-size-6">
      <ProfileLink :address="nft.issuer" :showTwitter="true" />
      <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
      <!-- <a :href="`https://kusama.subscan.io/account/${nft.currentOwner}`" target="_blank"><Identity :address="nft.currentOwner" /></a> -->
    </p>
    <template v-if="nft.issuer !== nft.currentOwner">
      <p class="label">
        {{ $t('owner') }}
      </p>
      <p class="subtitle is-size-6">
        <ProfileLink :address="nft.currentOwner" :showTwitter="true" />
        <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
        <!-- <a :href="`https://kusama.subscan.io/account/${nft.currentOwner}`" target="_blank"><Identity :address="nft.currentOwner" /></a> -->
      </p>
    </template>
    <template v-if="nft.delegate">
      <p class="label">
        {{ $t('delegate') }}
        <span>
          <a class="has-text-danger"><b-icon icon="times"> </b-icon></a>
        </span>
      </p>
      <p class="subtitle is-size-6">
        <ProfileLink :address="nft.delegate" :showTwitter="true" />
        <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import isShareMode from '@/utils/isShareMode'
import { NFTWithMeta } from '@/components/rmrk/service/scheme'
import { emptyObject } from '@/utils/empty'
// import Identity from '@/components/shared/format/Identity.vue'

const components = {
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
}

@Component({ components })
export default class Name extends Vue {
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
