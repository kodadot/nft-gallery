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
          <div class="nft-title">
            <Name :nft="nft" :isLoading="isLoading" />
          </div>

          <div v-if="meta.description" class="block">
            <p class="label">{{ $t('legend') }}</p>
            <b-skeleton
              :count="3"
              size="is-large"
              :active="isLoading"></b-skeleton>
            <DescriptionWrapper
              v-if="!isLoading"
              :text="meta.description.replaceAll('\n', '  \n')" />
          </div>
        </div>

        <div class="column is-6" v-if="detailVisible">
          <b-skeleton
            :count="2"
            size="is-large"
            :active="isLoading"></b-skeleton>

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
                          :account-id="accountId"
                          :current-owner-id="nft.currentOwner"
                          :price="nft.price"
                          :originialOwner="nft.issuer"
                          :nft-id="nft.id"
                          :ipfs-hashes="[
                            nft.image,
                            nft.animation_url,
                            nft.metadata,
                          ]"
                          :buyDisabled="isBuyDisabled"
                          @change="handleAction" />
                      </IndexerGuard>
                      <Auth @update-balance="setUserBalance" />
                    </p>
                  </div>

                  <Sharing class="mb-4" />
                </div>
              </div>
            </div>
          </div>
          <PriceChart
            class="mt-4"
            :priceChartData="priceChartData"
            :openOnDefault="!compactGalleryItem" />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="columns">
        <div class="column">
          <History
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
import nftListIdsByCollection from '@/queries/nftListIdsByCollection.graphql'
import { fetchNFTMetadata } from '../utils'
import { get, set } from 'idb-keyval'
import { MediaType } from '../types'
import axios from 'axios'
import { exist } from './Search/exist'
import Orientation from '@/utils/directives/DeviceOrientation'
import PrefixMixin from '~/utils/mixins/prefixMixin'

@Component<GalleryItem>({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    AvailableActions: () => import('./AvailableActions.vue'),
    Facts: () => import('@/components/rmrk/Gallery/Item/Facts.vue'),
    // MarkdownItVueLight: MarkdownItVueLight as VueConstructor<Vue>,
    History: () => import('@/components/rmrk/Gallery/History.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    Name: () => import('@/components/rmrk/Gallery/Item/Name.vue'),
    Navigation: () => import('@/components/rmrk/Gallery/Item/Navigation.vue'),
    Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
    Appreciation: () => import('@/components/rmrk/Gallery/Appreciation.vue'),
    MediaResolver: () => import('@/components/rmrk/Media/MediaResolver.vue'),
    // PackSaver: () => import('../Pack/PackSaver.vue'),
    IndexerGuard: () => import('@/components/shared/wrapper/IndexerGuard.vue'),
    DescriptionWrapper: () =>
      import('@/components/shared/collapse/DescriptionWrapper.vue'),
    Detail: () => import('@/components/rmrk/Gallery/Item/Detail.vue'),
    PriceChart: () => import('@/components/rmrk/Gallery/PriceChart.vue'),
    BaseGalleryItem: () =>
      import('@/components/shared/gallery/BaseGalleryItem.vue'),
  },
  directives: {
    orientation: Orientation,
  },
})
export default class GalleryItem extends mixins(PrefixMixin) {
  private id = ''
  private nft: NFT = emptyObject<NFT>()
  private nftsFromSameCollection: NFT[] = []
  private imageVisible = true
  private viewMode = this.$store.getters['preferences/getTheatreView']
  private isFullScreenView = false
  public isLoading = true
  public mimeType = ''
  public meta: NFTMetadata = emptyObject<NFTMetadata>()
  public emotes: Emote[] = []
  public message = ''
  public priceChartData: [Date, number][][] = []
  public showNavigation = false
  public userBalance
  public isBuyDisabled = false

  get accountId() {
    return this.$store.getters.getAuthAddress
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

      this.isLoading = false
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  public async created() {
    this.checkId()
    exist(this.$route.query.message, (val) => {
      this.message = val === 'congrats' ? val : ''
      this.$router.replace({ query: null } as any)
    })

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
  }

  onImageError(e: any) {
    console.warn('Image error', e)
  }

  public setPriceChartData(data: [Date, number][][]) {
    this.priceChartData = data
  }

  public async fetchCollectionItems() {
    const collectionId = (this.nft as any)?.collectionId
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
          meta.animation_url || meta.image,
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

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    }
  }

  public toggleView(): void {
    this.viewMode = this.viewMode === 'default' ? 'theatre' : 'default'
  }

  public toggleFullScreen(): void {
    this.isFullScreenView = !this.isFullScreenView
  }

  public minimize(): void {
    this.isFullScreenView = false
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message)
  }

  public setUserBalance(balance) {
    this.userBalance = balance
    this.isBuyDisabled = Number(this.nft.price) > Number(this.userBalance)
  }

  get hasPrice() {
    return Number(this.nft.price) > 0
  }

  get nftId() {
    const { id } = this.nft
    return id
  }

  get detailVisible() {
    return !isShareMode
  }

  get compactGalleryItem(): boolean {
    return this.$store.state.preferences.compactGalleryItem
  }

  protected handleAction(deleted: boolean) {
    if (deleted) {
      showNotification('INSTANCE REMOVED', notificationTypes.warn)
    }
  }

  protected handleUnlist() {
    // call unlist function from the AvailableActions component
    const availableActions = this.$refs.actions as AvailableActions
    availableActions.unlistNft()
  }

  @Watch('meta.image')
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
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

hr.comment-divider {
  border-top: 1px solid $lightpink;
  border-bottom: 1px solid $lightpink;
}

.fixed-height {
  height: 748px;
}

.gallery-item {
  .nft-title {
    margin-bottom: 24px;
  }

  .gallery-item__skeleton {
    width: 95%;
    margin: auto;
  }

  .image-wrapper {
    position: relative;
    margin: 30px auto;
    width: 100%;

    .image {
      border: 2px solid $primary;
    }

    .fullscreen-image {
      display: none;
    }

    .image-preview {
      .media-container {
        position: relative;
        padding-top: 100%;
        .media-item {
          position: absolute;
          top: 0;
          height: 100%;
        }
      }
      &.fullscreen {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 999998;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .column {
      transition: 0.3s all;
    }

    button {
      border: 2px solid $primary;
      color: #fff;
      font-weight: bold;
      text-transform: uppercase;
      padding: 7px 16px;
      font-size: 20px;
      background: $scheme-main;
      z-index: 2;

      &:hover {
        background: $primary;
        cursor: pointer;
      }
    }
  }

  button#theatre-view {
    position: absolute;
    top: 13px;
    left: 13px;
    color: $light-text;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  button#fullscreen-view {
    position: absolute;
    bottom: 13px;
    right: 13px;

    &.fullscreen {
      position: fixed;
      z-index: 999998;
      bottom: 0;
      right: 0;
    }
  }

  .price-block {
    border: 2px solid $primary;
    padding: 14px;

    &__original {
      font-size: 24px;
      text-transform: uppercase;
      font-weight: 500;
    }

    &__container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__exchange {
      opacity: 0.6;
      color: $dark;
      margin: 0;
    }
  }

  &.no-padding-desktop {
    @media screen and (min-width: 1023px) {
      padding: 0;
    }
  }

  .message-box {
    background: $dark !important;
    border: 2px solid $primary;
    box-shadow: $dropdown-content-shadow;
    .subtitle-text {
      color: $lightpink;
    }
    section {
      border: none !important;
    }
  }
}
</style>
