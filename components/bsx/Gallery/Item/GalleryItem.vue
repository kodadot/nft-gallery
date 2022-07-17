<template>
  <BaseGalleryItem
    v-if="nft"
    :image="meta.image"
    :animationUrl="meta.animation_url"
    :mimeType="mimeType"
    :description="meta.description"
    :imageVisible="imageVisible"
    :isLoading="isLoading">
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
    <template v-slot:main>
      <div class="columns">
        <div class="column is-6">
          <div class="nft-title">
            <Name :nft="nft" :isLoading="isLoading" />
          </div>

          <div v-if="meta.description" class="block">
            <p class="label">{{ $t('legend') }}</p>
            <VueMarkdown
              v-if="!isLoading"
              class="is-size-5"
              :source="meta.description.replaceAll('\n', '  \n')" />
            <b-skeleton
              :count="3"
              size="is-large"
              :active="isLoading"></b-skeleton>
          </div>

          <div class="block" v-if="meta.attributes && meta.attributes.length">
            <Properties :attributes="meta.attributes" fieldKey="trait_type" />
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
              <template v-if="detailVisible && !nft.burned">
                <div class="card bordered mb-4" aria-id="contentIdForA11y3">
                  <div class="card-content">
                    <template v-if="hasPrice">
                      <div class="label">
                        {{ $t('price') }}
                      </div>
                      <div class="price-block__container">
                        <div class="price-block__original">
                          <Money :value="nft.price" inline />
                        </div>
                      </div>
                      <div v-if="nftRoyalties">
                        ⊆ {{ $t('royalty') }}
                        <Money :value="nftRoyalties" inline />
                      </div>
                    </template>
                    <div class="content pt-4">
                      <p class="subtitle">
                        <AvailableActions
                          ref="actions"
                          :account-id="accountId"
                          :is-owner="isOwner"
                          :current-owner-id="nft.currentOwner"
                          :price="nft.price"
                          :nftId="id"
                          :delegateId="nft.delegate"
                          :collectionId="collectionId"
                          :frozen="nft.isFrozen"
                          :isMakeOffersAllowed="isMakeOffersAllowed"
                          :ipfs-hashes="[
                            nft.image,
                            nft.animation_url,
                            nft.metadata,
                          ]"
                          @change="handleAction" />
                        <Auth class="mt-4" />
                      </p>
                    </div>
                    <p class="subtitle is-size-6" v-if="accountId">
                      <span>{{ $t('general.balance') }}: </span>
                      <Money :value="balance" inline />
                    </p>
                    <Sharing :enableDownload="isOwner" class="mb-4" />
                  </div>
                </div>
              </template>
            </div>
          </div>
          <b-skeleton
            :count="2"
            size="is-large"
            :active="isLoading"></b-skeleton>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <OfferList
        :current-owner-id="nft.currentOwner"
        :nftId="id"
        @offersUpdate="offersUpdate"
        :collectionId="collectionId" />
    </template>
  </BaseGalleryItem>
</template>

<script lang="ts">
import { Emote, NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import {
  fetchNFTMetadata,
  getSanitizer,
  sanitizeIpfsUrl,
} from '@/components/rmrk/utils'
import { createTokenId, tokenIdToRoute } from '@/components/unique/utils'
import { toHuman, unwrapOrDefault, unwrapOrNull } from '@/utils/api/format'
import onApiConnect from '@/utils/api/general'
import Orientation from '@/utils/directives/DeviceOrientation'
import { emptyObject } from '@/utils/empty'
import isShareMode from '@/utils/isShareMode'
import SubscribeMixin from '@/utils/mixins/subscribeMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { Option, u128 } from '@polkadot/types'
import { InstanceDetails } from '@polkadot/types/interfaces'
import { get, set } from 'idb-keyval'
import { Component, mixins, Vue } from 'nuxt-property-decorator'
import { processMedia } from '@/utils/gallery/media'
import AuthMixin from '~/utils/mixins/authMixin'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import resolveQueryPath from '~/utils/queryPathResolver'
import { getMetadata, getOwner, getPrice, hasAllPallets } from './utils'
import { isEmpty } from '@kodadot1/minimark'
import { royaltyOf } from '@/utils/royalty'
import { isOwner } from '~/utils/account'
import { generateNftImage } from '~/utils/seoImageGenerator'
import { formatBsxBalanceEmptyOnZero } from '~/utils/format/balance'

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
    AvailableActions: () => import('./AvailableActions.vue'),
    Name: () => import('@/components/rmrk/Gallery/Item/Name.vue'),
    Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
    IndexerGuard: () => import('@/components/shared/wrapper/IndexerGuard.vue'),
    VueMarkdown: () => import('vue-markdown-render'),
    Detail: () => import('@/components/unique/Gallery/Item/Detail.vue'),
    DangerModal: () =>
      import('@/components/unique/Gallery/Item/DangerModal.vue'),
    Properties: () => import('@/components/unique/Gallery/Item/Properties.vue'),
    BaseGalleryItem: () =>
      import('@/components/shared/gallery/BaseGalleryItem.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    OfferList: () => import('@/components/bsx/Offer/OfferList.vue'),
  },
  directives: {
    orientation: Orientation,
  },
})
export default class GalleryItem extends mixins(
  SubscribeMixin,
  PrefixMixin,
  AuthMixin
) {
  private id = ''
  private collectionId = ''
  private nft: NFT = emptyObject<NFT>()
  private imageVisible = true
  public isLoading = false
  public mimeType = ''
  public meta: NFTMetadata = emptyObject<NFTMetadata>()
  public emotes: Emote[] = []
  public message = ''
  public isMakeOffersAllowed = true

  public async created() {
    this.checkId()
    await this.fetchNftData()
    onApiConnect((api) => {
      if (hasAllPallets(api)) {
        this.subscribe(getOwner(api), this.tokenId, this.observeOwner)
        this.subscribe(getPrice(api), this.tokenId, this.observePrice)
      }
    })
  }

  get isOwner(): boolean {
    return isOwner(this.nft.currentOwner, this.accountId)
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }

  get tokenId(): [string, string] {
    return [this.collectionId, this.id]
  }

  get pageTitle(): string {
    return this.nft?.name || ''
  }

  get image(): string {
    return generateNftImage(
      this.nft.name,
      formatBsxBalanceEmptyOnZero(this.nft.price as string),
      this.meta.image as string,
      this.mimeType
    )
  }

  public offersUpdate({ offers }) {
    this.isMakeOffersAllowed = !offers.find(({ caller }) => {
      return caller === this.accountId
    })
  }

  protected observeOwner(data: Option<InstanceDetails>) {
    const instance = unwrapOrNull(data)
    if (instance) {
      this.$set(this.nft, 'currentOwner', toHuman(instance.owner))
    }
  }

  protected observePrice(data: Option<u128>) {
    this.$set(this.nft, 'price', unwrapOrDefault(data).toString())
  }

  private async fetchNftData() {
    const query = await resolveQueryPath(this.urlPrefix, 'nftById')
    const nft = await this.$apollo.query({
      query: query.default,
      client: this.urlPrefix,
      variables: {
        id: createTokenId(this.collectionId, this.id),
      },
    })
    const {
      data: { nftEntity },
    } = nft

    if (!nftEntity) {
      this.$consola.warn(`No NFT with ID ${this.id} fallback to RPC Node`)
      this.fetchRPCMetadata()
      // showNotification(`No NFT with ID ${this.id}`, notificationTypes.warn)
      return
    }

    this.nft = {
      ...this.nft,
      ...nftEntity,
    }

    if (nftEntity.meta) {
      this.meta = {
        ...this.meta,
        ...nftEntity.meta,
        image: sanitizeIpfsUrl(nftEntity.meta.image || ''),
      }
    }

    this.fetchMetadata()
  }

  protected fetchRPCMetadata() {
    onApiConnect(async (api) => {
      const metacall = getMetadata(api)
      const res = await metacall(this.collectionId, this.id).then((option) =>
        unwrapOrNull(option as Option<any>)
      )
      if (res) {
        Vue.set(this.nft, 'metadata', res.metadata.toHuman())
        this.fetchMetadata()
      }
    })
  }

  onImageError(e: any) {
    this.$consola.warn('Image error', e)
  }

  public async fetchMetadata() {
    if (this.nft['metadata']) {
      const cachedMeta = await get(this.nft.metadata)

      const meta = !isEmpty(cachedMeta)
        ? cachedMeta
        : await fetchNFTMetadata(
            this.nft,
            getSanitizer(this.nft.metadata, 'pinata', 'permafrost')
          )

      const imageSanitizer = getSanitizer(meta.image, 'pinata')
      this.meta = {
        ...meta,
        image: imageSanitizer(meta.image),
        animation_url: sanitizeIpfsUrl(
          meta.animation_url || meta.image,
          'pinata'
        ),
      }

      if (!this.nft.name && meta.name) {
        Vue.set(this.nft, 'name', meta.name)
      }

      if (this.meta.animation_url && !this.mimeType) {
        const { mimeType, imageVisible } = await processMedia(
          this.meta.animation_url
        )
        this.mimeType = mimeType
        this.imageVisible = imageVisible
      }

      if (!cachedMeta && !isEmpty(meta)) {
        set(this.nft.metadata, meta)
      }
    }
  }

  public checkId() {
    if (this.$route.params.id) {
      const { id, item } = tokenIdToRoute(this.$route.params.id)
      this.id = item
      this.collectionId = id
    }
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message)
  }

  get hasPrice(): boolean {
    return Number(this.nft.price) > 0
  }

  get nftRoyalties(): string {
    return this.nft.price && this.nft.royalty
      ? royaltyOf(this.nft.price, this.nft.royalty)
      : ''
  }

  get nftId() {
    const { id } = this.nft
    return id
  }

  get detailVisible() {
    return !isShareMode
  }

  protected handleAction(deleted: boolean) {
    if (deleted) {
      showNotification('INSTANCE REMOVED', notificationTypes.warn)
    }
  }
}
</script>
