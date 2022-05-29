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
                <div class="card-content">
                  <div class="content pt-4">
                    <p class="subtitle">
                      <Auth />
                    </p>
                    <p class="subtitle is-size-6" v-if="accountId">
                      <span>{{ $t('general.balance') }}: </span>
                      <Money :value="balance" inline />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseGalleryItem>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import { sanitizeIpfsUrl, resolveMedia, getSanitizer, fetchNFTMetadata } from '@/components/rmrk/utils'
import { emptyObject } from '@/utils/empty'
import { notificationTypes, showNotification } from '@/utils/notification'
import isShareMode from '@/utils/isShareMode'
import { get, set } from 'idb-keyval'
import { MediaType } from '@/components/rmrk/types'
import axios from 'axios'
import Orientation from '@/utils/directives/DeviceOrientation'
import AuthMixin from '~/utils/mixins/authMixin'
import { toUrl } from '~/utils/ipfs'
import { parse, build, OneOrMore, IfThat } from '@kodadot1/if-that'

type MetaWithLogic = NFTMetadata & { logic: IfThat<NFT & NFTMetadata>[] }

@Component<GalleryItem>({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    Name: () => import('@/components/rmrk/Gallery/Item/Name.vue'),
    Navigation: () => import('@/components/rmrk/Gallery/Item/Navigation.vue'),
    DescriptionWrapper: () =>
      import('@/components/shared/collapse/DescriptionWrapper.vue'),
    Detail: () => import('@/components/unique/Gallery/Item/Detail.vue'),
    BaseGalleryItem: () =>
      import('@/components/shared/gallery/BaseGalleryItem.vue'),
  },
  directives: {
    orientation: Orientation,
  },
})
export default class GalleryItem extends mixins(AuthMixin) {
  private nft: NFT = emptyObject<NFT>()
  private nftsFromSameCollection: NFT[] = []
  private imageVisible = true
  public isLoading = true
  public mimeType = ''
  public meta: MetaWithLogic = emptyObject()
  public showNavigation = false

  get id(): string {
    return this.$route.params.id
  }

  // TODO: mock data from url params
  async fetch() {
    console.log(this.$route.query)
    try {
      if (!this.id) {
        throw new Error('No id provided')
      }

      this.overrideParams()
      this.fetchMetadata()

    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  protected overrideParams() {
    const overrides = this.$route.query as Record<string, string>
    const useAccount = this.accountId ? { currentOwner: this.accountId, issuer: this.accountId } : {}
    this.nft = {
      ...this.nft,
      ...useAccount,
      ...overrides
    }
  }

  public async fetchMetadata() {
      const link = toUrl(this.id)
      const m = await get(link)

      const meta = m
        ? m
        : await fetchNFTMetadata(
            { metadata: link },
            getSanitizer(link, undefined, 'permafrost')
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

      // const parsedLogic = this.meta.logic ? build(this.meta.logic, this.nft) : {}

      this.nft = {
        ...this.nft,
        ...meta,
        // ...parsedLogic,
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
        set(link, meta)
      }

      this.isLoading = false
  }

  get nftId(): string {
    const { id } = this.nft
    return id
  }

  get detailVisible(): boolean {
    return !isShareMode
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }
}
</script>
