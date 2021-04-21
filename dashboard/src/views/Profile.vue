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
              ><Identity ref="identity" :address="id" :inline="true"
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
  defaultSortBy,
  sanitizeObjectArray
} from '@/components/rmrk/utils';
import {
  Collection,
  CollectionWithMeta,
  NFTWithMeta,
  Pack
} from '@/components/rmrk/service/scheme';
import isShareMode from '@/utils/isShareMode';
import Identity from '../components/shared/format/Identity.vue';

const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue')
};

const eq = (tab: string) => (el: string) => tab === el

@Component<Profile>({ 
  components,
  metaInfo() {
    const title = `${this.name} | KodaDot Profile`;
    return {
      meta: [
        { property: 'og:title', content: title },
        { property: 'og:type', content: 'website'},
        { property: 'og:image', vmid: 'og:image', content: this.firstNFT as string},
        { property: 'twitter:title', content: title },
        { property: 'twitter:site', content: '@KodaDot' },
        { property: 'twitter:image', vmid: 'twitter:image', content: this.firstNFT as string },
        { property: 'twitter:card', content: 'summary_large_image' },
      ]
    };
  },
 })
export default class Profile extends Vue {
  public activeTab: string = 'nft';
  protected id: string = '';
  protected isLoading: boolean = false;
  protected collections: CollectionWithMeta[] = [];
  protected nfts: NFTWithMeta[] = [];
  protected packs: Pack[] = [];
  protected name: string = '';

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
        .then(sanitizeObjectArray)
        .then(defaultSortBy);
      // this.nftMeta();
      this.collections = await rmrkService.getCollectionListForAccount(
        this.id
      )
      .then(sanitizeObjectArray)
      .then(defaultSortBy);
      // this.collectionMeta();
      this.packs = await rmrkService.getPackListForAccount(this.id).then(defaultSortBy);
      // console.log(packs)
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger);
      console.warn(e);
    }
    this.isLoading = false;
    this.name = ((this.$refs['identity'] as Identity).name as string);
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

  get firstNFT() {
    if(this.nfts !== undefined && this.nfts.length !== 0) {
      const firstNft = this.nfts.find(nft => nft.image && nft.type && nft.type.includes('image'));
      if(firstNft !== undefined) return firstNft.image;
    }
    const url = new URL(window.location.href);
    return `${url.protocol}${url.hostname}/img/kodadot_logo_v1_transparent_400px.56bb186b.png}`;
  }

  public checkActiveTab() {
    if (this.$route.params.tab && ['nft', 'collection', 'pack'].some(eq(this.$route.params.tab))) {
      this.activeTab = this.$route.params.tab;
    }
  }

}
</script>

<style >
.invisible-tab > nav.tabs {
  display: none;
}
</style>
