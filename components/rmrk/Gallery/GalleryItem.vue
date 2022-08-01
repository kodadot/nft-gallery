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
            <Sharing :enableDownload="isOwner" />
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
                          :is-owner="isOwner"
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
                    <AccountBalance />
                  </div>

                  <Sharing :enableDownload="isOwner" class="mb-4" />
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
import { sanitizeIpfsUrl, getSanitizer } from '../utils'
import { processMedia } from '@/utils/gallery/media'
import { emptyObject } from '@/utils/empty'
import { notificationTypes, showNotification } from '@/utils/notification'
import { generateNftImage } from '@/utils/seoImageGenerator'
import { formatBalanceEmptyOnZero } from '@/utils/format/balance'

import isShareMode from '@/utils/isShareMode'
import nftById from '@/queries/subsquid/rmrk/nftById.graphql'
import nftListIdsByCollection from '@/queries/subsquid/general/nftIdListByCollection.graphql'
import nftByIdMinimal from '@/queries/rmrk/subsquid/nftByIdMinimal.graphql'
import eventListByNftId from '@/queries/subsquid/general/eventListByNftId.graphql'

import { fetchNFTMetadata } from '../utils'
import { get, set } from 'idb-keyval'
import { exist } from './Search/exist'
import Orientation from '@/utils/directives/DeviceOrientation'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { Debounce } from 'vue-debounce-decorator'
import AvailableActions from './AvailableActions.vue'
import { isOwner } from '@/utils/account'
import { unwrapSafe } from '@/utils/uniquery'
import { mapToId } from '@/utils/mappers'

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
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$root.$config.baseUrl + this.$route.path,
        },
      ],
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
