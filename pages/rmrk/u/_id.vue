<template>
  <section>
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
        </div>
      </div>
      <div class="column has-text-right">
        <Sharing
          class="mb-2"
          v-if="!sharingVisible"
          :label="$t('sharing.profile')"
          :iframe="iframeSettings"
        >
          <DonationButton :address="id" />
        </Sharing>
      </div>
    </div>

      <b-tabs
        :class="{ 'invisible-tab': sharingVisible }"
        class="tabs-container-mobile"
        v-model="activeTab"
        destroy-on-hide
        expanded
      >
        <b-tab-item value="nft" :headerClass="{'is-hidden': !totalCollections}">
          <template #header>
            <b-tooltip :label="`${$i18n.t('tooltip.created')} ${shortendId}`" append-to-body>
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
            <b-tooltip :label="`${$i18n.t('tooltip.collections')} ${shortendId}`" append-to-body>
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
            route="/rmrk/collection"
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
           <b-tooltip :label="`${$i18n.t('tooltip.sold')} ${shortendId}`" append-to-body>
            {{ $t("profile.sold") }}
            <span class="tab-counter" v-if="totalSold">{{ totalSold }}</span>
           </b-tooltip>
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
            <b-tooltip :label="`${$i18n.t('tooltip.collected')} ${shortendId}`" append-to-body>
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
      </b-tabs>
  </section>
</template>

<script lang="ts">
import { Component, mixins, Vue, Watch } from 'nuxt-property-decorator'
import { notificationTypes, showNotification } from '@/utils/notification'
import { sanitizeIpfsUrl, fetchNFTMetadata } from '@/components/rmrk/utils'
import { CollectionWithMeta, Pack } from '@/components/rmrk/service/scheme'
import isShareMode from '@/utils/isShareMode'
import shouldUpdate from '@/utils/shouldUpdate'
import shortAddress from '@/utils/shortAddress'
import collectionList from '@/queries/collectionListByAccount.graphql'
import nftListByIssuer from '@/queries/nftListByIssuer.graphql'
import nftListCollected from '@/queries/nftListCollected.graphql'
import nftListSold from '@/queries/nftListSold.graphql'
import firstNftByIssuer from '@/queries/firstNftByIssuer.graphql'
import PrefixMixin from '~/utils/mixins/prefixMixin'

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
  Layout: () => import('@/components/rmrk/Gallery/Layout.vue')
}

const eq = (tab: string) => (el: string) => tab === el

@Component<Profile>({
  name: 'Profile',
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
export default class Profile extends mixins(PrefixMixin) {
  public firstNFTData: any = {}
  protected id = ''
  protected shortendId = ''
  protected isLoading = false
  protected collections: CollectionWithMeta[] = []
  protected packs: Pack[] = []
  protected name = ''
  // protected property: {[key: string]: any} = {};
  protected email = ''
  protected twitter = ''
  protected web = ''
  protected legal = ''
  protected riot = ''
  private currentValue = 1
  private first = 20
  private total = 0
  private currentCollectionPage = 1
  protected totalCollections = 0

  protected totalCreated = 0
  protected totalCollected = 0
  protected totalSold = 0

  readonly nftListByIssuer = nftListByIssuer
  readonly nftListCollected = nftListCollected
  readonly nftListSold = nftListSold

  public async mounted() {
    await this.fetchProfile()
  }

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.shortendId = shortAddress(this.id)
    }
  }

  get activeTab(): string {
    return this.$route.query.tab as string || 'nft'
  }

  set activeTab(val) {
    this.$route.query.page = ''
    this.$router.replace({
      query: { tab: val },
    })
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
      `${url.protocol}//${url.hostname}/placeholder.webp`
    )
  }

  protected async fetchProfile() {
    this.checkId()

    try {
      this.$apollo.addSmartQuery('collections', {
        query: collectionList,
        client: this.urlPrefix,
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
        client: this.urlPrefix,
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
</style>


