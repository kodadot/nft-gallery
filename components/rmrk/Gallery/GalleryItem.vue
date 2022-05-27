<template>
  <BaseGalleryItem
    :image="meta.image"
    :animationUrl="meta.animation_url"
    :description="meta.description"
    :imageVisible="imageVisible"
    :isLoading="isLoading"
    :mimeType="mimeType"
    @mouseEntered="showNavigation = true"
    @mouseLeft="showNavigation = false">
    <template v-slot:top v-if="message">
      <b-message class="message-box" type="is-primary">
        <div class="columns">
          <div class="column is-four-fifths">
            <p class="title is-3 has-text-black">{{ $t('mint.success') }} 🎉</p>
            <p class="subtitle is-size-5 subtitle-text">
              {{ $t('mint.shareWithFriends', [nft.name]) }} △
            </p>
          </div>
          <div class="column">
            <Sharing onlyCopyLink />
          </div>
        </div>
      </b-message>
    </template>
    <template v-slot:image>
      <Navigation
        v-if="nftsFromSameCollection && nftsFromSameCollection.length > 1"
        :showNavigation="showNavigation"
        :items="nftsFromSameCollection"
        :currentId="nft.id" />
    </template>
    <template v-slot:main>
      <div class="columns">
        <div class="column is-6">
          <Appreciation
            :emotes="nft.emotes"
            :accountId="accountId"
            :currentOwnerId="nft.currentOwner"
            :nftId="nft.id"
            :burned="nft.burned" />

          <Name :nft="nft" :isLoading="isLoading" class="mb-5" />

          <b-skeleton :active="isLoading" :count="3"></b-skeleton>
          <div v-if="meta.description" class="block">
            <p class="label">{{ $t('legend') }}</p>
            <DescriptionWrapper
              v-if="!isLoading"
              :text="meta.description.replaceAll('\n', '  \n')" />
          </div>
        </div>

        <div class="column is-6" v-if="detailVisible">
          <div class="columns">
            <div class="column">
              <div class="nft-title">
                <Detail :nft="nft" :isLoading="isLoading" />
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
                        <Money :value="nft.price" inline />
                      </div>
                      <b-button
                        v-if="nft.currentOwner === accountId"
                        type="is-warning"
                        outlined
                        @click="handleUnlist">
                        {{ $t('Unlist') }}
                      </b-button>
                    </div>
                  </template>

                  <div class="content pt-4">
                    <p class="subtitle">
                      <IndexerGuard show-message class="pb-4">
                        <AvailableActions
                          ref="actions"
                          :current-owner-id="nft.currentOwner"
                          :price="nft.price"
                          :originialOwner="nft.issuer"
                          :nft-id="nft.id"
                          :ipfs-hashes="[
                            nft.image,
                            nft.animation_url,
                            nft.metadata,
                          ]"
                          :buyDisabled="hasBuyDisabled"
                          @change="handleAction" />
                      </IndexerGuard>
                      <Auth />
                    </p>
                    <p class="subtitle is-size-6" v-if="accountId">
                      <span>{{ $t('general.balance') }}: </span>
                      <Money :value="balance" inline />
                    </p>
                  </div>

                  <Sharing class="mb-4" />
                </div>
              </div>
            </div>
          </div>
          <LazyGalleryPriceChart
            class="mt-4"
            :priceChartData="priceChartData"
            :openOnDefault="!compactGalleryItem" />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <GalleryItemCarousel
        v-if="showRelatedCarousel"
        type="related"
        :collectionId="nft.collectionId" />
      <GalleryItemCarousel type="visited" />

      <div class="columns">
        <div class="column">
          <LazyGalleryHistory
            v-if="!isLoading"
            :events="nft.events"
            :open-on-default="!compactGalleryItem"
            @setPriceChartData="setPriceChartData" />
        </div>
      </div>
    </template>
  </BaseGalleryItem>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { NFT, NFTMetadata, Emote } from '../service/scheme'
import { sanitizeIpfsUrl, resolveMedia, getSanitizer } from '../utils'
import { emptyObject } from '@/utils/empty'

import AvailableActions from './AvailableActions.vue'
import { notificationTypes, showNotification } from '@/utils/notification'

import isShareMode from '@/utils/isShareMode'
import nftById from '@/queries/nftById.graphql'
import nftByIdMini from '@/queries/nftByIdMinimal.graphql'
import nftByIdMinimal from '@/queries/rmrk/subsquid/nftByIdMinimal.graphql'
import nftListIdsByCollection from '@/queries/nftListIdsByCollection.graphql'
import { fetchNFTMetadata } from '../utils'
import { get, set } from 'idb-keyval'
import { MediaType } from '../types'
import axios from 'axios'
import { exist } from './Search/exist'
import Orientation from '@/utils/directives/DeviceOrientation'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { Debounce } from 'vue-debounce-decorator'

@Component<GalleryItem>({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    AvailableActions: () => import('./AvailableActions.vue'),
    Facts: () => import('@/components/rmrk/Gallery/Item/Facts.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    Name: () => import('@/components/rmrk/Gallery/Item/Name.vue'),
    Navigation: () => import('@/components/rmrk/Gallery/Item/Navigation.vue'),
    Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
    Appreciation: () => import('@/components/rmrk/Gallery/Appreciation.vue'),
    MediaResolver: () => import('@/components/rmrk/Media/MediaResolver.vue'),
    IndexerGuard: () => import('@/components/shared/wrapper/IndexerGuard.vue'),
    DescriptionWrapper: () =>
      import('@/components/shared/collapse/DescriptionWrapper.vue'),
    Detail: () => import('@/components/unique/Gallery/Item/Detail.vue'),
    BaseGalleryItem: () =>
      import('@/components/shared/gallery/BaseGalleryItem.vue'),
    GalleryItemCarousel: () => import('./GalleryItemCarousel.vue'),
  },
  directives: {
    orientation: Orientation,
  },
})
export default class GalleryItem extends mixins(PrefixMixin) {
  private nft: NFT = emptyObject<NFT>()
  private nftsFromSameCollection: NFT[] = []
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

  async fetch() {
    try {
      const {
        data: { nFTEntity },
      } = await this.$apollo.query({
        client: this.urlPrefix,
        query: nftById,
        variables: {
          id: this.id,
        },
      })

      this.nft = {
        ...nFTEntity,
        emotes: nFTEntity?.emotes?.nodes,
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
      client: this.urlPrefix,
      query: nftByIdMini,
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

  @Debounce(500)
  private async updateEventList() {
    const { data } = await this.$apollo.query<{ nft }>({
      client: 'subsquid',
      query: nftByIdMinimal,
      variables: {
        id: this.id,
      },
    })
    this.nft.events =
      data.nft?.events.map((e) => ({
        ...e,
        nft: { id: this.id },
      })) ?? []
  }

  public async fetchCollectionItems() {
    const collectionId = this.nft?.collectionId
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
          client: this.urlPrefix,
          variables: {
            id: collectionId,
          },
        })

        const {
          data: { nFTEntities },
        } = nfts

        this.nftsFromSameCollection =
          nFTEntities?.nodes.map((n: { id: string }) => n.id) || []
        this.$store.dispatch('history/setCurrentCollection', {
          id: collectionId,
          nftIds: this.nftsFromSameCollection,
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

      const imageSanitizer = getSanitizer(meta.image)
      this.meta = {
        ...meta,
        image: imageSanitizer(meta.image),
        animation_url: sanitizeIpfsUrl(
          meta.animation_url || meta.image || meta.mediaUri,
          'pinata'
        ),
      }

      if (this.meta.animation_url && !this.mimeType) {
        const { headers } = await axios.head(this.meta.animation_url)
        this.mimeType = headers['content-type']
        const mediaType = resolveMedia(this.mimeType)
        this.imageVisible = ![
          MediaType.VIDEO,
          MediaType.MODEL,
          MediaType.IFRAME,
          MediaType.OBJECT,
        ].some((t) => t === mediaType)
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
      Boolean(this.nft.collectionId) && this.nftsFromSameCollection.length > 0
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
