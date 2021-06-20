<template>
  <div class="profile-wrapper container">
    <div class="tile">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title">
            <b-icon pack="fas" icon="ghost"></b-icon>
            <a :href="`https://kusama.subscan.io/account/${id}`" target="_blank"
              ><Identity ref="identity" :address="id" :inline="true"
            /></a>
            <OnChainProperty 
              v-bind:email="email"
              v-bind:twitter="twitter"
              v-bind:web="web"
              v-bind:legal="legal"
              v-bind:riot="riot"
               />
          </p>
          <Sharing
            v-if="!sharingVisible"
            label="Check this awesome Profile on %23KusamaNetwork %23KodaDot"
            :iframe="iframeSettings"
          />
        </div>
      </div>
    </div>
    <b-tabs
      :class="{ 'invisible-tab': sharingVisible }"
      type="is-boxed"
      v-model="activeTab"
      expanded
      destroy-on-hide
    >
      <b-tab-item label="NFTs" value="nft">
        <Pagination simple :total="total" v-model="currentValue" />
        <GalleryCardList :items="nfts" />
        <Pagination class="pt-5 pb-5" :total="total" v-model="currentValue" />
      </b-tab-item>
      <b-tab-item label="Collections" value="collection">
        <Pagination
          simple
          :total="totalCollections"
          v-model="currentCollectionPage"
        />
        <GalleryCardList
          :items="collections"
          type="collectionDetail"
          link="rmrk/collection"
        />
        <Pagination
          class="pt-5 pb-5"
          :total="totalCollections"
          v-model="currentCollectionPage"
        />
      </b-tab-item>
      <b-tab-item label="Packs" value="pack">
        <GalleryCardList :items="packs" type="packDetail" link="rmrk/pack" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { notificationTypes, showNotification } from '@/utils/notification';
import {
  defaultSortBy,
} from '@/components/rmrk/utils';
import {
  CollectionWithMeta,
  NFTWithMeta,
  Pack
} from '@/components/rmrk/service/scheme';
import isShareMode from '@/utils/isShareMode';
import Identity from '../components/shared/format/Identity.vue';
import shouldUpdate from '@/utils/shouldUpdate';
import nftList from '@/queries/nftListByAccount.graphql';
import collectionList from '@/queries/collectionListByAccount.graphql';

const components = {
  GalleryCardList: () =>
    import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  OnChainProperty: () => import('@/views/OnChainProperty.vue')
};

const eq = (tab: string) => (el: string) => tab === el;

@Component<Profile>({
  components,
  metaInfo() {
    return {
      meta: [
        {
          property: 'og:image',
          vmid: 'og:image',
          content: this.firstNFT as string
        },
        { property: 'twitter:site', content: '@KodaDot' },
        {
          property: 'twitter:image',
          vmid: 'twitter:image',
          content: this.firstNFT as string
        },
        { property: 'twitter:card', content: 'summary_large_image' }
      ]
    };
  }
})
export default class Profile extends Vue {
  public activeTab: string = 'nft';
  protected id: string = '';
  protected isLoading: boolean = false;
  protected collections: CollectionWithMeta[] = [];
  protected nfts: NFTWithMeta[] = [];
  protected packs: Pack[] = [];
  protected name: string = '';
  // protected property: {[key: string]: any} = {};
  protected email: string = '';
  protected twitter: string = '';
  protected web: string = '';
  protected legal: string = '';
  protected riot: string = '';
  private currentValue = 1;
  private first = 20;
  private total = 0;
  private currentCollectionPage = 1;
  private totalCollections = 0;

  public async mounted() {
    await this.fetchProfile();
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
    return { width: '100%', height: '100vh', customUrl: this.customUrl };
  }

  get offset() {
    return this.currentValue * this.first - this.first;
  }

  get collectionOffset() {
    return this.currentCollectionPage * this.first - this.first;
  }

  protected async fetchProfile() {
    this.checkId();
    this.checkActiveTab();
    const rmrkService = getInstance();
    if (!rmrkService || !this.id) {
      return;
    }

    try {
      this.$apollo.addSmartQuery('nfts', {
        query: nftList,
        manual: true,
        // update: ({ nFTEntities }) => nFTEntities.nodes,
        loadingKey: 'isLoading',
        result: this.handleResult,
        variables: () => {
          return {
            account: this.id,
            first: this.first,
            offset: this.offset
          };
        }
      });

      this.$apollo.addSmartQuery('collections', {
        query: collectionList,
        manual: true,
        // update: ({ nFTEntities }) => nFTEntities.nodes,
        loadingKey: 'isLoading',
        result: this.handleCollectionResult,
        variables: () => {
          return {
            account: this.id,
            first: this.first,
            offset: this.collectionOffset
          };
        }
      });
      // this.nftMeta();
      // this.collections = await rmrkService
      //   .getCollectionListForAccount(this.id)
      //   .then(sanitizeObjectArray)
      //   .then(defaultSortBy);
      // this.collectionMeta();
      this.packs = await rmrkService
        .getPackListForAccount(this.id)
        .then(defaultSortBy);
      // console.log(packs)
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger);
      console.warn(e);
    }
    // this.isLoading = false;
    this.name = (this.$refs['identity'] as Identity).name as string;
    this.email = (this.$refs['identity'] as Identity).email as string;
    this.twitter = (this.$refs['identity'] as Identity).twitter as string;
    this.riot = (this.$refs['identity'] as Identity).riot as string;
    this.web = (this.$refs['identity'] as Identity).web as string;
    this.legal = (this.$refs['identity'] as Identity).legal as string;

    console.log(this.email, this.twitter);
  }

  protected async handleResult({ data }: any) {
    this.total = data.nFTEntities.totalCount;
    this.nfts = data.nFTEntities.nodes;
  }

    protected async handleCollectionResult({ data }: any) {
    this.totalCollections = data.collectionEntities.totalCount;
    console.log(data)
    this.collections = data.collectionEntities.nodes;
  }

  get firstNFT() {
    if (this.nfts !== undefined && this.nfts.length !== 0) {
      const firstNft = this.nfts.find(
        nft => nft.image && nft.type && nft.type.includes('image')
      );
      if (firstNft !== undefined) return firstNft.image;
    }
    const url = new URL(window.location.href);
    return `${url.protocol}${url.hostname}/img/kodadot_logo_v1_transparent_400px.56bb186b.png}`;
  }

  public checkActiveTab() {
    if (
      this.$route.params.tab &&
      ['nft', 'collection', 'pack'].some(eq(this.$route.params.tab))
    ) {
      this.activeTab = this.$route.params.tab;
    }
  }

  @Watch('$route.params.id')
  protected onIdChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.fetchProfile();
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/variables";

.invisible-tab > nav.tabs {
  display: none;
}
</style>
