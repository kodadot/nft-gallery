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
              rel="noopener noreferrer">
              <Identity
                ref="identity"
                :address="id"
                emit
                @change="handleIdentity" />
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
            <ProfileLink
              :address="id"
              :inline="true"
              show-twitter
              show-discord />
            <a
              :href="`https://sub.id/#/${id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="is-inline-flex is-align-items-center pt-2">
              <figure class="image is-24x24 subid__less-margin">
                <img alt="subid" src="/subid.svg" />
              </figure>
              {{ shortendId }}
            </a>
          </div>
        </div>
        <div class="column has-text-right">
          <Sharing
            v-if="!sharingVisible"
            class="mb-2"
            :label="$t('sharing.profile')"
            :iframe="iframeSettings">
            <DonationButton :address="id" />
          </Sharing>
        </div>
      </div>

      <b-tabs
        v-model="activeTab"
        :class="{ 'invisible-tab': sharingVisible }"
        destroy-on-hide
        expanded
        size="is-medium">
        <b-tab-item value="nft">
          <template #header>
            {{ $t('profile.created') }}
            <span v-if="totalCreated" class="tab-counter">{{
              totalCreated
            }}</span>
          </template>
          <PaginatedCardList
            :id="id"
            :query="nftListByIssuer"
            :account="id"
            :show-search-bar="true"
            route="gallery"
            @change="totalCreated = $event" />
        </b-tab-item>
        <b-tab-item
          :label="`Collections - ${totalCollections}`"
          value="collection">
          <Pagination
            v-model="currentCollectionPage"
            has-magic-btn
            replace
            :total="totalCollections" />
          <GalleryCardList :items="collections" route="collection" />
          <Pagination
            v-model="currentCollectionPage"
            replace
            class="pt-5 pb-5"
            :total="totalCollections" />
        </b-tab-item>
        <b-tab-item value="sold">
          <template #header>
            {{ $t('profile.sold') }}
            <span v-if="totalSold" class="tab-counter">{{ totalSold }}</span>
          </template>
          <PaginatedCardList
            :id="id"
            :query="nftListSold"
            :account="id"
            route="gallery"
            @change="totalSold = $event" />
        </b-tab-item>
        <b-tab-item value="collected">
          <template #header>
            {{ $t('profile.collected') }}
            <span v-if="totalCollected" class="tab-counter">{{
              totalCollected
            }}</span>
          </template>
          <PaginatedCardList
            :id="id"
            :query="nftListCollected"
            :account="id"
            route="gallery"
            @change="totalCollected = $event" />
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
import { Component, Watch, mixins } from 'nuxt-property-decorator'

import { CollectionWithMeta, Pack } from '@/components/rmrk/service/scheme'
import { fetchNFTMetadata, sanitizeIpfsUrl } from '@/components/rmrk/utils'

import { notificationTypes, showNotification } from '@/utils/notification'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import isShareMode from '@/utils/isShareMode'
import shortAddress from '@/utils/shortAddress'
import shouldUpdate from '@/utils/shouldUpdate'

import collectionList from '@/queries/unique/collectionListByAccount.graphql'
import firstNftByIssuer from '@/queries/subsquid/general/firstNftByIssuer.graphql'
import nftListByIssuer from '@/queries/subsquid/general/nftListByIssuer.graphql'
import nftListCollected from '@/queries/subsquid/general/nftListCollected.graphql'
import nftListSold from '@/queries/subsquid/general/nftListSold.graphql'

const components = {
  GalleryCardList: () =>
    import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/shared/Sharing.vue'),
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  PaginatedCardList: () =>
    import('@/components/rmrk/Gallery/PaginatedCardList.vue'),
  DonationButton: () => import('@/components/transfer/DonationButton.vue'),
  Avatar: () => import('@/components/shared/Avatar.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  ShowQRModal: () => import('@/components/shared/modals/ShowQRModal.vue'),
}

@Component<Profile>({
  components,
  head() {
    const title = 'NFT Artist Profile on KodaDot'
    const metaData = {
      title,
      type: 'profile',
      description:
        this.firstNFTData.description || 'Find more NFTs from this creator',
      url: `/westmint/u/${this.id}`,
      image: this.firstNFTData.image || this.defaultNFTImage,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
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
    return (this.$route.query.tab as string) || 'nft'
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

  get iframeSettings(): { width: string; height: string; customUrl: string } {
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
    return `${url.protocol}//${url.hostname}/placeholder.webp`
  }

  protected async fetchProfile() {
    this.checkId()

    try {
      this.$apollo.addSmartQuery('collections', {
        query: collectionList,
        manual: true,
        client: this.urlPrefix,
        // update: ({ nFTEntities }) => nFTEntities.nodes,
        loadingKey: 'isLoading',
        result: this.handleCollectionResult,
        variables: () => {
          return {
            account: this.id,
            first: this.first,
            offset: this.collectionOffset,
          }
        },
        fetchPolicy: 'cache-and-network',
      })

      this.$apollo.addSmartQuery('firstNft', {
        query: firstNftByIssuer,
        manual: true,
        client: this.client,
        loadingKey: 'isLoading',
        result: this.handleResult,
        variables: () => {
          return {
            account: this.id,
          }
        },
        fetchPolicy: 'cache-and-network',
      })

      // this.packs = await rmrkService
      //   .getPackListForAccount(this.id)
      //   .then(defaultSortBy);
      // this.$consola.log(packs)
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger)
      this.$consola.warn(e)
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
          image: sanitizeIpfsUrl(meta.image || ''),
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
.invisible-tab > nav.tabs {
  display: none;
}

.tab-counter::before {
  content: ' - ';
  white-space: pre;
}

.title {
  flex-grow: 0;
  flex-basis: auto;
}

.subid__less-margin {
  margin: auto 0.5em auto 0;
}
</style>
