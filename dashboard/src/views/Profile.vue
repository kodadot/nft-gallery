<template>
  <div class="profile-wrapper">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title">
            <b-icon
              pack="fas"
              icon="ghost"
            ></b-icon>
            <a :href="`https://kusama.subscan.io/account/${id}`" target="_blank"
              ><Identity :address="id" :inline="true"
            /></a>
          </p>
          <Sharing v-if="!sharingVisible" label="Check this awesome Profile on %23KusamaNetwork %23KodaDot" :iframe="iframeSettings" />
        </div>
      </div>
    </div>
    <b-tabs :class="{ 'invisible-tab': sharingVisible }" type="is-toggle" v-model="activeTab" expanded >
      <b-tab-item label="NFTs" value="nft" >
        <GalleryCardList :items="nfts" />
      </b-tab-item>
      <b-tab-item label="Collections" value="collection" >
        <GalleryCardList :items="collections" type="collectionDetail" link="rmrk/collection" />
      </b-tab-item>
      <b-tab-item label="Packs" value="pack" >
        <GalleryCardList :items="packs" type="packDetail" link="rmrk/pack" />
      </b-tab-item>
    </b-tabs>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { notificationTypes, showNotification } from '@/utils/notification';
import {
  fetchNFTMetadata,
  sanitizeIpfsUrl,
  defaultSortBy,
  fetchCollectionMetadata
} from '@/components/rmrk/utils';
import {
  Collection,
  CollectionWithMeta,
  NFTWithMeta,
  Pack
} from '@/components/rmrk/service/scheme';
import isShareMode from '@/utils/isShareMode';

const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue')
};

const eq = (tab: string) => (el: string) => tab === el

@Component({ components })
export default class Profile extends Vue {
  public activeTab: string = 'nft';
  private id: string = '';
  private isLoading: boolean = false;
  private collections: CollectionWithMeta[] = [];
  private nfts: NFTWithMeta[] = [];
  private packs: Pack[] = [];

  public async mounted() {
    this.checkId();
    this.checkActiveTab();
    const rmrkService = getInstance();
    if (!rmrkService || !this.id) {
      return;
    }

    this.isLoading = true;

    try {
      this.nfts = await rmrkService
        .getNFTsForAccount(this.id)
        .then(defaultSortBy);
      this.nftMeta();
      this.collections = await rmrkService.getCollectionListForAccount(
        this.id
      ).then(defaultSortBy);
      this.collectionMeta();
      this.packs = await rmrkService.getPackListForAccount(this.id).then(defaultSortBy);
      // console.log(packs)
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger);
      console.warn(e);
    }

    this.isLoading = false;
  }

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
  }

  get sharingVisible() {
    return isShareMode;
  }

  get customUrl() {
    return `${window.location.origin}${this.$route.path}/${this.activeTab}`;
  }

  get iframeSettings() {
    return { width: '100%', height: '100vh', customUrl: this.customUrl }
  }

  public checkActiveTab() {
    if (this.$route.params.tab && ['nft', 'collection', 'pack'].some(eq(this.$route.params.tab))) {
      this.activeTab = this.$route.params.tab;
    }
  }

  collectionMeta() {
    this.collections.map(fetchCollectionMetadata).forEach(async (call, index) => {
      const res = await call;
      Vue.set(this.collections, index, {
        ...this.collections[index],
        ...res,
        image: sanitizeIpfsUrl(res.image || '')
      });
    });
  }

  nftMeta() {
    this.nfts.map(fetchNFTMetadata).forEach(async (call, index) => {
      const res = await call;
      Vue.set(this.nfts, index, {
        ...this.nfts[index],
        ...res,
        image: sanitizeIpfsUrl(res.image || '')
      });
    });
  }


}
</script>

<style >
.invisible-tab > nav.tabs {
  display: none;
}
</style>
