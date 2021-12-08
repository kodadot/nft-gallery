<template>
  <div class="section">
    <div class="profile-wrapper container">
      <div class="columns is-centered">
        <div class="column is-half has-text-centered">
          <div class="container image is-64x64 mb-2">
            <Avatar :value="id" />
          </div>
          <h1 class="title is-2">
            <a
              :href="`https://kusama.subscan.io/account/${id}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Identity ref="identity" :address="id" inline emit @change="handleIdentity" />
            </a>
          </h1>
        </div>
      </div>

      <div class="columns is-mobile">
        <div class="column">
          <div class="label">
            {{ $t('profile.user') }}
          </div>
          <div class="subtitle is-size-6">
            <ProfileLink :address="id" :inline="true" :showTwitter="true"/>
            <a :href="`https://sub.id/#/${id}`" target="_blank" rel="noopener noreferrer" class="is-inline-flex is-align-items-center pt-2">
              <figure class="image is-24x24 subid__less-margin">
                <img alt="subid" src="/subid.svg" />
              </figure>
              {{ shortendId }}
            </a>
          </div>
        </div>
        <div class="column has-text-right">
          <Sharing
            class="mb-2"
            v-if="!sharingVisible"
            label="Check this awesome Profile on %23KusamaNetwork %23KodaDot"
            :iframe="iframeSettings"
          >
            <DonationButton :address="id" />
          </Sharing>
        </div>
      </div>

      <b-tabs
        :class="{ 'invisible-tab': sharingVisible }"
        class="collection-tabs"
        v-model="activeTab"
        destroy-on-hide
        expanded
        size="is-medium"
      >
        <b-tab-item value="nft" :headerClass="{'is-hidden': !totalCollections}">
          <template #header>
            <b-tooltip :label="`Created By ${shortendId}`">
              {{ $t("profile.created") }}
              <span class="tab-counter" v-if="totalCreated">{{
                totalCreated
              }}</span>
            </b-tooltip>
          </template>
          <PaginatedCardList
            :id="id"
            :query="nftListByIssuer"
            @change="totalCreated = $event"
            :account="id"
            :showSearchBar="true"
          />
        </b-tab-item>
        <b-tab-item
          :label="`Collections - ${totalCollections}`"
          value="collection"
          :headerClass="{'is-hidden': !totalCollections}"
         >
          <template #header>
            <b-tooltip :label="`Collections created by ${shortendId}`">
              {{ $t("Collections") }}
              <span class="tab-counter" v-if="totalCollections">{{
                totalCollections
              }}</span>
            </b-tooltip>
          </template>
          <div class="is-flex is-justify-content-flex-end">
            <Layout class="mr-5" />
            <Pagination
              hasMagicBtn
              replace
              :total="totalCollections"
              v-model="currentCollectionPage"
            />
          </div>
          <GalleryCardList
            :items="collections"
            type="collectionDetail"
            link="rmrk/collection"
            horizontalLayout
          />
          <Pagination
            replace
            class="pt-5 pb-5"
            :total="totalCollections"
            v-model="currentCollectionPage"
          />
        </b-tab-item>
        <b-tab-item value="sold" :headerClass="{'is-hidden': !totalCollections}">
          <template #header>
            {{ $t("profile.sold") }}
            <span class="tab-counter" v-if="totalSold">{{ totalSold }}</span>
          </template>
          <PaginatedCardList
            :id="id"
            :query="nftListSold"
            @change="totalSold = $event"
            :account="id"
            showSearchBar
          />
        </b-tab-item>
        <b-tab-item value="collected">
          <template #header>
            <b-tooltip :label="`Nfts collected by ${shortendId}`">
              {{ $t("profile.collected") }}
              <span class="tab-counter" v-if="totalCollected">{{
                totalCollected
              }}</span>
            </b-tooltip>
          </template>
          <PaginatedCardList
            :id="id"
            :query="nftListCollected"
            @change="totalCollected = $event"
            :account="id"
            showSearchBar
          />
        </b-tab-item>

        <!-- <b-tab-item label="Packs" value="pack">
          <span>TODO: Reintroduce</span>
          <GalleryCardList :items="packs" type="packDetail" link="rmrk/pack" />
        </b-tab-item> -->
      </b-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { notificationTypes, showNotification } from '@/utils/notification'
import { sanitizeIpfsUrl, fetchNFTMetadata } from '@/components/rmrk/utils'
import { exist } from '@/components/rmrk/Gallery/Search/exist'
import { CollectionWithMeta, Pack } from '@/components/rmrk/service/scheme'
import isShareMode from '@/utils/isShareMode'
import shouldUpdate from '@/utils/shouldUpdate'
import shortAddress from '@/utils/shortAddress'
import collectionList from '@/queries/collectionListByAccount.graphql'
import nftListByIssuer from '@/queries/nftListByIssuer.graphql'
import nftListCollected from '@/queries/nftListCollected.graphql'
import nftListSold from '@/queries/nftListSold.graphql'
import firstNftByIssuer from '@/queries/firstNftByIssuer.graphql'

const components = {
  GalleryCardList: () =>
    import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  PaginatedCardList: () =>
    import('@/components/rmrk/Gallery/PaginatedCardList.vue'),
  DonationButton: () => import('@/components/transfer/DonationButton.vue'),
  Avatar: () => import('@/components/shared/Avatar.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  ShowQRModal: () => import('@/components/shared/modals/ShowQRModal.vue'),
  Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
}

const eq = (tab: string) => (el: string) => tab === el

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
    }
  }
})
export default class Profile extends Vue {
  public activeTab = 'nft';
  public firstNFTData: any = {};
  protected id = '';
  protected shortendId = '';
  protected isLoading = false;
  protected collections: CollectionWithMeta[] = [];
  protected packs: Pack[] = [];
  protected name = '';
  // protected property: {[key: string]: any} = {};
  protected email = '';
  protected twitter = '';
  protected web = '';
  protected legal = '';
  protected riot = '';
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
    await this.fetchProfile()
    exist(this.$route.query.tab, (val) => {
      this.activeTab = val
    })
  }

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.shortendId = shortAddress(this.id)
    }
  }

  get sharingVisible(): boolean {
    return isShareMode
  }

  get customUrl(): string {
    return `${window.location.origin}${this.$route.path}/${this.activeTab}`
  }

  get iframeSettings(): {width: string, height: string, customUrl: string} {
    return { width: '100%', height: '100vh', customUrl: this.customUrl }
  }

  get offset(): number {
    return this.currentValue * this.first - this.first
  }

  get collectionOffset(): number {
    return this.currentCollectionPage * this.first - this.first
  }

  get defaultNFTImage(): string {
    const url = new URL(window.location.href)
    return (
      `${url.protocol}//${url.hostname}/koda300x300.svg`
    )
  }

  protected async fetchProfile() {
    this.checkId()
    this.checkActiveTab()

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
          }
        },
        fetchPolicy: 'cache-and-network'
      })

      this.$apollo.addSmartQuery('firstNft', {
        query: firstNftByIssuer,
        manual: true,
        loadingKey: 'isLoading',
        result: this.handleResult,
        variables: () => {
          return {
            account: this.id
          }
        },
        fetchPolicy: 'cache-and-network'
      })

      // this.packs = await rmrkService
      //   .getPackListForAccount(this.id)
      //   .then(defaultSortBy);
      // console.log(packs)
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger)
      console.warn(e)
    }
    // this.isLoading = false;

  }

  protected async handleResult({ data }: any) {
    if (!this.firstNFTData.image && data) {
      const nfts = data.nFTEntities.nodes
      if (nfts?.length) {
        const meta = await fetchNFTMetadata(nfts[0])
        this.firstNFTData = {
          ...meta,
          image: sanitizeIpfsUrl(meta.image || '')
        }
      }
    }
  }

  protected async handleCollectionResult({ data }: any) {
    if (data) {
      this.totalCollections = data.collectionEntities.totalCount
      if (this.totalCollections === 0) {
        this.activeTab = 'collected'
      }
      this.collections = data.collectionEntities.nodes
    }
  }

  protected handleIdentity(identityFields: Record<string, string>) {
    this.email = identityFields?.email as string
    this.twitter = identityFields?.twitter as string
    this.riot = identityFields?.riot as string
    this.web = identityFields?.web as string
    this.legal = identityFields?.legal as string
  }

  public checkActiveTab() {
    if (
      this.$route.params.tab &&
      ['nft', 'collection', 'pack'].some(eq(this.$route.params.tab))
    ) {
      this.activeTab = this.$route.params.tab
    }
  }

  @Watch('activeTab')
  protected onTabChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.$router.replace({
        name: String(this.$route.name),
        query: { tab: val },
      })
    }
  }

  @Watch('$route.params.id')
  protected onIdChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.fetchProfile()
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

.subid__less-margin {
  margin: auto .5em auto 0;
}
</style>

<style lang="scss">

.collection-tabs > nav.tabs {
  @media screen and (min-width: 1023px) {
    overflow: visible;
  }
}
</style>
