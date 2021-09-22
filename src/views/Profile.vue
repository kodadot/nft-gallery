<template>
  <div class="profile-wrapper container">
    <div class="columns">
      <div class="column">
        <div class="columns is-align-items-center">
          <div class="column title">
            <b-icon pack="fas" icon="ghost"></b-icon>
            <a
              :href="`https://kusama.subscan.io/account/${id}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Identity ref="identity" :address="id" inline emit @change="handleIdentity" />
            </a>
          </div>
            <DonationButton :address="id" />
          <div class="column">
            <OnChainProperty
              v-bind:email="email"
              v-bind:twitter="twitter"
              v-bind:web="web"
              v-bind:legal="legal"
              v-bind:riot="riot"
            />
          </div>
        </div>
      </div>
      <div class="column is-2">
        <Sharing
          v-if="!sharingVisible"
          label="Check this awesome Profile on %23KusamaNetwork %23KodaDot"
          :iframe="iframeSettings"
        />
      </div>
    </div>
    <b-tabs
      :class="{ 'invisible-tab': sharingVisible }"
      v-model="activeTab"
      destroy-on-hide
      expanded
      size="is-medium"
    >
      <b-tab-item value="nft">
        <template #header>
          {{ $t("profile.created") }}
          <span class="tab-counter" v-if="totalCreated">{{ totalCreated }}</span>
        </template>
        <PaginatedCardList
          :id="id"
          :query="nftListByIssuer"
          @change="totalCreated = $event"
          :account="id"
        />
      </b-tab-item>
      <b-tab-item value="collected">
        <template #header>
          {{ $t("profile.collected") }}
          <span class="tab-counter" v-if="totalCollected">{{ totalCollected }}</span>
        </template>
        <PaginatedCardList
          :id="id"
          :query="nftListCollected"
          @change="totalCollected = $event"
          :account="id"
        />
      </b-tab-item>
      <b-tab-item value="sold">
        <template #header>
          {{ $t("profile.sold") }}
          <span class="tab-counter" v-if="totalSold">{{ totalSold }}</span>
        </template>
        <PaginatedCardList
          :id="id"
          :query="nftListSold"
          @change="totalSold = $event"
          :account="id"
        />
      </b-tab-item>
      <b-tab-item
        :label="`Collections - ${totalCollections}`"
        value="collection"
      >
        <Pagination :total="totalCollections" v-model="currentCollectionPage" />
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

      <!-- <b-tab-item label="Packs" value="pack">
        <span>TODO: Reintroduce</span>
        <GalleryCardList :items="packs" type="packDetail" link="rmrk/pack" />
      </b-tab-item> -->
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { notificationTypes, showNotification } from '@/utils/notification';
import { sanitizeIpfsUrl, fetchNFTMetadata } from '@/components/rmrk/utils';

import {
  CollectionWithMeta,
  NFTWithMeta,
  Pack
} from '@/components/rmrk/service/scheme';
import isShareMode from '@/utils/isShareMode';
import Identity from '../components/shared/format/Identity.vue';
import shouldUpdate from '@/utils/shouldUpdate';
import collectionList from '@/queries/collectionListByAccount.graphql';
import nftListByIssuer from '@/queries/nftListByIssuer.graphql';
import nftListCollected from '@/queries/nftListCollected.graphql';
import nftListSold from '@/queries/nftListSold.graphql';
import firstNftByIssuer from '@/queries/firstNftByIssuer.graphql';

const components = {
  GalleryCardList: () =>
    import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  OnChainProperty: () => import('@/views/OnChainProperty.vue'),
  PaginatedCardList: () =>
    import('@/components/rmrk/Gallery/PaginatedCardList.vue'),
  DonationButton: () => import('@/components/transfer/DonationButton.vue'),

};

const eq = (tab: string) => (el: string) => tab === el;

@Component<Profile>({
  components,
  metaInfo() {
    return {
      meta: [
        {
          property: 'og:title',
          vmid: 'og:title',
          content: 'NFT Artist Profile on KodaDot'
        },
        {
          property: 'og:description',
          vmid: 'og:description',
          content:
            (this.firstNFTData.description as string) ||
            'Find more NFTs from this creator'
        },
        {
          property: 'og:image',
          vmid: 'og:image',
          content:
            (this.firstNFTData.image as string) ||
            (this.defaultNFTImage as string)
        },
        { property: 'twitter:site', content: '@KodaDot' },
        { property: 'twitter:card', content: 'summary_large_image' },
        {
          property: 'twitter:title',
          vmid: 'twitter:title',
          content: 'NFT Artist Profile on KodaDot'
        },
        {
          property: 'twitter:description',
          vmid: 'twitter:description',
          content:
            (this.firstNFTData.description as string) ||
            'Find more NFTs from this creator'
        },
        {
          property: 'twitter:image',
          vmid: 'twitter:image',
          content:
            (this.firstNFTData.image as string) ||
            (this.defaultNFTImage as string)
        }
      ]
    };
  }
})
export default class Profile extends Vue {
  public activeTab: string = 'nft';
  public firstNFTData: any = {};
  protected id: string = '';
  protected isLoading: boolean = false;
  protected collections: CollectionWithMeta[] = [];
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
  protected totalCollections = 0;

  protected totalCreated = 0;
  protected totalCollected = 0;
  protected totalSold = 0;

  readonly nftListByIssuer = nftListByIssuer;
  readonly nftListCollected = nftListCollected;
  readonly nftListSold = nftListSold;

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

  get defaultNFTImage() {
    const url = new URL(window.location.href);
    return (
      `${url.protocol}//${url.hostname}/koda300x300.svg`
    );
  }

  protected async fetchProfile() {
    this.checkId();
    this.checkActiveTab();

    try {
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
        },
        fetchPolicy: 'cache-and-network'
      });

      this.$apollo.addSmartQuery('firstNft', {
        query: firstNftByIssuer,
        manual: true,
        loadingKey: 'isLoading',
        result: this.handleResult,
        variables: () => {
          return {
            account: this.id
          };
        },
        fetchPolicy: 'cache-and-network'
      });

      // this.packs = await rmrkService
      //   .getPackListForAccount(this.id)
      //   .then(defaultSortBy);
      // console.log(packs)
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger);
      console.warn(e);
    }
    // this.isLoading = false;

  }

  protected async handleResult({ data }: any) {
    if (!this.firstNFTData.image && data) {
      const nfts = data.nFTEntities.nodes;
      if (nfts?.length) {
        const meta = await fetchNFTMetadata(nfts[0]);
        this.firstNFTData = {
          ...meta,
          image: sanitizeIpfsUrl(meta.image || '')
        };
      }
    }
  }

  protected async handleCollectionResult({ data }: any) {
    if (data) {
      this.totalCollections = data.collectionEntities.totalCount;
      this.collections = data.collectionEntities.nodes;
    }
  }

  protected handleIdentity(identityFields: Record<string, string>) {
    this.email = identityFields?.email as string;
    this.twitter = identityFields?.twitter as string;
    this.riot = identityFields?.riot as string;
    this.web = identityFields?.web as string;
    this.legal = identityFields?.legal as string;
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

<style lang="scss" scoped>
@import "@/styles/variables";

.invisible-tab > nav.tabs {
  display: none;
}

.tab-counter::before {
  content: " - ";
  white-space: pre;
}

.title {
  flex-grow: 0;
  flex-basis: auto;
}
</style>
