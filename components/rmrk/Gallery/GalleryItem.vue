<template>
  <BaseGalleryItem
    :image="meta.image"
    :animation-url="meta.animation_url"
    :description="meta.description"
    :image-visible="imageVisible"
    :is-loading="isLoading"
    :mime-type="mimeType"
    @mouseEntered="showNavigation = true"
    @mouseLeft="showNavigation = false">
    <template v-if="message" #top>
      <MessageNotify
        :enable-download="isOwner"
        :title="$t('mint.success') + ' 🎉'"
        :subtitle="$t('mint.successNewNfts')" />
    </template>
    <template #image>
      <Navigation
        v-if="nftsFromSameCollection && nftsFromSameCollection.length > 1"
        :show-navigation="showNavigation"
        :items="nftsFromSameCollection"
        :current-id="nft.id" />
    </template>
    <template #main>
      <div class="columns">
        <div class="column is-6">
          <Appreciation
            :emotes="nft.emotes"
            :account-id="accountId"
            :current-owner-id="nft.currentOwner"
            :nft-id="nft.id"
            :burned="nft.burned" />

          <Name
            :nft="nft"
            :is-loading="isLoading"
            class="mb-5"
            data-cy="item-title" />

          <b-skeleton :active="isLoading" :count="3"></b-skeleton>
          <div v-if="meta.description" class="block" data-cy="item-description">
            <p class="label">{{ $t('legend') }}</p>
            <DescriptionWrapper
              v-if="!isLoading"
              :text="meta.description.replaceAll('\n', '  \n')" />
          </div>
          <div v-if="meta.attributes && meta.attributes.length" class="block">
            <Properties :attributes="meta.attributes" field-key="trait_type" />
          </div>
        </div>

        <div v-if="detailVisible" class="column is-6">
          <div class="columns">
            <div class="column">
              <div class="nft-title">
                <Detail :nft="nft" :is-loading="isLoading" />
              </div>
            </div>
            <div
              class="column is-flex is-flex-direction-column is-justify-content-space-between">
              <div class="card bordered mb-4" aria-id="contentIdForA11y3">
                <div :class="{ 'money-cursor': hasPrice }" class="card-content">
                  <template v-if="hasPrice">
                    <div class="label">
                      {{ $t('price') }}
                    </div>
                    <div class="price-block__container">
                      <div class="price-block__original">
                        <Money :value="nft.price" inline data-cy="money" />
                      </div>
                      <b-button
                        v-if="nft.currentOwner === accountId"
                        type="is-warning"
                        class="only-border-top"
                        outlined
                        @click="handleUnlist">
                        {{ $t('Unlist') }}
                      </b-button>
                    </div>
                  </template>

                  <div class="content pt-4">
                    <p class="subtitle">
                      <AvailableActions
                        ref="actions"
                        :current-owner-id="nft.currentOwner"
                        :is-owner="isOwner"
                        :price="nft.price"
                        :originial-owner="nft.issuer"
                        :nft-id="nft.id"
                        :ipfs-hashes="[
                          nft.image,
                          nft.animation_url,
                          nft.metadata,
                        ]"
                        :buy-disabled="hasBuyDisabled"
                        @change="handleAction" />
                      <Auth />
                    </p>
                    <AccountBalance />
                  </div>

                  <Sharing :enable-download="isOwner" class="mb-4" />
                </div>
              </div>
            </div>
          </div>
          <LazyGalleryPriceChart
            class="mt-4"
            :price-chart-data="priceChartData"
            :open-on-default="!compactGalleryItem" />
        </div>
      </div>
    </template>
    <template #footer>
      <CarouselTypeRelated
        v-if="showRelatedCarousel"
        :collection-id="nft.collection.id"
        data-cy="carousel-related" />
      <CarouselTypeVisited />

      <div class="columns">
        <div class="column">
          <LazyGalleryHistory
            v-if="!isLoading"
            :events="nft.events"
            :open-on-default="!compactGalleryItem"
            data-cy="history"
            @setPriceChartData="setPriceChartData" />
        </div>
      </div>
    </template>
  </BaseGalleryItem>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import { get, set } from 'idb-keyval'
import { Debounce } from 'vue-debounce-decorator'

import { Emote, NFT, NFTMetadata } from '../service/scheme'
import { getSanitizer, sanitizeIpfsUrl } from '../utils'
import { exist } from '@/components/search/exist'
import { fetchNFTMetadata } from '../utils'

import { notificationTypes, showNotification } from '@/utils/notification'
import Orientation from '@/utils/directives/DeviceOrientation'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { emptyObject } from '@/utils/empty'
import { formatBalanceEmptyOnZero } from '@/utils/format/balance'
import { generateNftImage } from '@/utils/seoImageGenerator'
import { isOwner } from '@/utils/account'
import isShareMode from '@/utils/isShareMode'
import { mapToId } from '@/utils/mappers'
import { processMedia } from '@/utils/gallery/media'
import { unwrapSafe } from '@/utils/uniquery'

import eventListByNftId from '@/queries/subsquid/general/eventListByNftId.graphql'
import nftById from '@/queries/subsquid/rmrk/nftById.graphql'
import nftByIdMinimal from '@/queries/rmrk/subsquid/nftByIdMinimal.graphql'
import nftListIdsByCollection from '@/queries/subsquid/general/nftIdListByCollection.graphql'

import AvailableActions from './AvailableActions.vue'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

@Component<GalleryItem>({
  name: 'GalleryItem',
  head() {
    const metaData = {
      mime: this.mimeType,
      title: this.pageTitle,
      description: this.meta.description,
      url: this.$route.path,
      image: this.image,
      video: this.meta.animation_url,
    }
    return {
      title: this.pageTitle,
      meta: [...this.$seoMeta(metaData)],
    }
  },
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    AvailableActions,
    Facts: () => import('@/components/rmrk/Gallery/Item/Facts.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    AccountBalance: () => import('@/components/shared/AccountBalance.vue'),
    Name: () => import('@/components/rmrk/Gallery/Item/Name.vue'),
    Navigation: () => import('@/components/rmrk/Gallery/Item/Navigation.vue'),
    Sharing: () => import('@/components/shared/Sharing.vue'),
    Appreciation: () => import('@/components/rmrk/Gallery/Appreciation.vue'),
    MediaResolver: () => import('@/components/media/MediaResolver.vue'),
    Properties: () => import('@/components/shared/gallery/Properties.vue'),
    DescriptionWrapper: () =>
      import('@/components/shared/collapse/DescriptionWrapper.vue'),
    Detail: () => import('@/components/unique/Gallery/Item/Detail.vue'),
    BaseGalleryItem: () =>
      import('@/components/shared/gallery/BaseGalleryItem.vue'),
    CarouselTypeRelated: () =>
      import('@/components/carousel/CarouselTypeRelated.vue'),
    CarouselTypeVisited: () =>
      import('@/components/carousel/CarouselTypeVisited.vue'),
  },
  directives: {
    orientation: Orientation,
  },
})
export default class GalleryItem extends mixins(PrefixMixin) {
  private nft: NFT = emptyObject<NFT>()
  private nftsFromSameCollection: string[] = []
  private imageVisible = true
  public isLoading = true
  public mimeType = ''
  public meta: NFTMetadata = emptyObject<NFTMetadata>()
  public emotes: Emote[] = []
  public message = ''
  public priceChartData: [Date, number][][] = []
  public showNavigation = false

  get accountId(): string {
    return this.$store.getters.getAuthAddress
  }

  get id(): string {
    return `${this.$route.params.id}${this.$route.hash || ''}`
  }

  get pageTitle(): string {
    return `${this.nft.name || ''}`
  }

  get tokenId() {
    return getKusamaAssetId(this.urlPrefix)
  }

  get image(): string {
    return generateNftImage(
      this.nft.name,
      formatBalanceEmptyOnZero(this.nft.price as string),
      this.meta.image as string,
      this.mimeType
    )
  }

  async fetch() {
    try {
      const {
        data: { nftEntity: nFTEntity },
      } = await this.$apollo.query({
        client: this.client,
        query: nftById,
        variables: {
          id: this.id,
        },
      })

      this.nft = {
        ...nFTEntity,
        emotes: unwrapSafe(nFTEntity?.emotes),
      }

      this.fetchMetadata()
      this.fetchCollectionItems()
      this.updateEventList()

      this.isLoading = false

      exist(this.$route.query.message, (val) => {
        this.message = val === 'congrats' ? val : ''
        this.$router.replace({ query: null } as any)
      })
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  public mounted() {
    // used to poll nft every second after component initialization in order to prevent double spending
    this.$apollo.addSmartQuery<{ nft }>('nft', {
      client: this.client,
      query: nftByIdMinimal,
      manual: true,
      variables: {
        id: this.id,
      },
      result: ({ data }) => {
        this.nft = {
          ...this.nft,
          ...data.nft,
        }
      },
      pollInterval: 1000,
    })

    if (this.message === 'congrats') {
      this.toast(this.message)
    }
  }

  public setPriceChartData(data: [Date, number][][]) {
    this.priceChartData = data
  }

  get isOwner(): boolean {
    return isOwner(this.nft.currentOwner, this.accountId)
  }

  @Debounce(500)
  private async updateEventList() {
    const { data } = await this.$apollo.query<{ events: any[] }>({
      client: this.client,
      query: eventListByNftId,
      variables: {
        id: this.id,
      },
    })
    this.nft.events =
      data.events?.map((e) => ({
        ...e,
        nft: { id: this.id },
      })) ?? []
  }

  public async fetchCollectionItems() {
    const collectionId = this.nft?.collection.id
    if (collectionId) {
      // cancel request and get ids from store in case we already fetched collection data before
      if (this.$store.state.history?.currentCollection?.id === collectionId) {
        this.nftsFromSameCollection =
          this.$store.state.history.currentCollection?.nftIds || []
        return
      }
      try {
        const nfts = await this.$apollo.query({
          query: nftListIdsByCollection,
          client: this.client,
          variables: {
            id: collectionId,
          },
        })

        const {
          data: { nftEntities },
        } = nfts

        this.nftsFromSameCollection = unwrapSafe(nftEntities).map(mapToId) || []
        this.$store.dispatch('history/setCurrentCollection', {
          id: collectionId,
          nftIds: this.nftsFromSameCollection,
          prefix: this.urlPrefix,
        })
      } catch (e) {
        showNotification(`${e}`, notificationTypes.warn)
      }
    }
  }

  public async fetchMetadata() {
    if (this.nft['metadata'] && !this.meta['image']) {
      const m = await get(this.nft.metadata)

      const meta = m
        ? m
        : await fetchNFTMetadata(
            this.nft,
            getSanitizer(this.nft.metadata, undefined, 'permafrost')
          )

      const imageSanitizer = getSanitizer(meta.image, 'image')
      this.meta = {
        ...meta,
        image: imageSanitizer(meta.image),
        animation_url: sanitizeIpfsUrl(
          meta.animation_url || meta.image || meta.mediaUri,
          'pinata'
        ),
      }

      if (this.meta.animation_url && !this.mimeType) {
        const { mimeType, imageVisible } = await processMedia(
          this.meta.animation_url
        )
        this.mimeType = mimeType
        this.imageVisible = imageVisible
      }

      if (!m) {
        set(this.nft.metadata, meta)
      }
    }
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message)
  }

  get hasPrice(): boolean {
    return Number(this.nft.price) > 0
  }

  get nftId(): string {
    const { id } = this.nft
    return id
  }

  get detailVisible(): boolean {
    return !isShareMode
  }

  get compactGalleryItem(): boolean {
    return this.$store.state.preferences.compactGalleryItem
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }

  get hasBuyDisabled(): boolean {
    return this.balance ? Number(this.nft.price) > Number(this.balance) : true
  }

  get showRelatedCarousel(): boolean {
    return (
      Boolean(this.nft.collection?.id) && this.nftsFromSameCollection.length > 0
    )
  }

  protected handleAction() {
    this.$fetch()
  }

  protected handleUnlist() {
    // call unlist function from the AvailableActions component
    const availableActions = this.$refs.actions as AvailableActions
    availableActions.unlistNft()
  }

  @Watch('meta', { deep: true })
  handleNFTPopulationFinished(newVal) {
    if (newVal) {
      // save visited detail page to history
      this.$store.dispatch('history/addHistoryItem', {
        id: this.id,
        name: this.nft.name,
        image: this.meta.image,
        collection: (this.nft.collection as any).name,
        date: new Date(),
        description: this.meta.description,
        author: this.nft.currentOwner,
        price: this.nft.price,
        mimeType: this.mimeType,
        prefix: this.urlPrefix,
      })
    }
  }

  @Watch('nft.currentOwner')
  @Watch('nft.price')
  @Watch('nft.burned')
  watchEventChange() {
    this.updateEventList()
  }
}
</script>
