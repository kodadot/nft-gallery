<template>
    <div>
      <div v-if="detailVisible">
        <p
          class="title"
          :class="[ detailVisible ? 'is-size-1' : 'is-size-3' ]"
        >
          <span v-if="!isLoading">
           <span v-if="nft.burned">「🔥」</span> {{ nft.name }} <span v-if="carbonlessBadge">「🌱」</span>
          </span>
          <b-skeleton height="100px" size="is-large" :active="isLoading"></b-skeleton>
        </p>
        <p v-if="nft.burned" class="title is-size-4 has-text-danger">
          {{ $t('nft.burned') }} 「🔥」
          <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
        </p>
        <p v-if="carbonlessBadge" class="title is-size-4 has-text-success">
          {{ $t('nft.carbonless') }} 「🌱」
          <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
        </p>
        <p class="label">
          {{ $t('collection') }}
        </p>
        <p class="subtitle is-size-6">
          <router-link :to="{ name: 'collectionDetail', params: { id: nft.collectionId } }">
            {{ nft.collectionId }}
          </router-link>
          <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
        </p>
        <p class="label">
          {{ $t('owner') }}
        </p>
        <p class="subtitle is-size-6">
          <ProfileLink :address="nft.currentOwner" />
          <ProfileTwitterLink :address="nft.currentOwner" />
          <b-skeleton :count="1" size="is-large" :active="isLoading"></b-skeleton>
          <!-- <a :href="`https://kusama.subscan.io/account/${nft.currentOwner}`" target="_blank"><Identity :address="nft.currentOwner" /></a> -->
        </p>
      </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';
import isShareMode from '@/utils/isShareMode';
import { NFTWithMeta } from '../../service/scheme';
import { emptyObject } from '@/utils/empty';
// import Identity from '@/components/shared/format/Identity.vue'

const components = {
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  ProfileTwitterLink: () => import('@/components/rmrk/Profile/ProfileTwitterLink.vue')
}

@Component({ components })
export default class Name extends Vue {
  @Prop({ default: () => emptyObject<NFTWithMeta>() }) public nft!: NFTWithMeta;
  @Prop() public isLoading!: boolean;

  get detailVisible() {
    return !isShareMode
  }

  get carbonlessBadge() {
    return this.nft.attributes?.some(({trait_type, value}) => trait_type === 'carbonless' && value)
  }
}
</script>
