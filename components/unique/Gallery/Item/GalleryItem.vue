<template>
  <BaseGalleryItem
    :image="meta.image"
    :animationUrl="meta.animation_url"
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
            <Sharing onlyCopyLink />
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

          <div class="block" v-if="nft.attributes && nft.attributes.length">
            <Properties :attributes="nft.attributes" />
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
                    </template>
                    <div class="content pt-4">
                      <p class="subtitle">
                        <IndexerGuard show-message class="pb-4">
                          <AvailableActions
                            ref="actions"
                            :account-id="accountId"
                            :current-owner-id="nft.currentOwner"
                            :price="nft.price"
                            :nftId="id"
                            :delegateId="nft.delegate"
                            :collectionId="collectionId"
                            :frozen="nft.isFrozen"
                            :ipfs-hashes="[
                              nft.image,
                              nft.animation_url,
                              nft.metadata,
                            ]"
                            @change="handleAction" />
                        </IndexerGuard>
                        <Auth />
                      </p>
                    </div>
                    <DangerModal
                      v-if="accountId === nft.currentOwner"
                      title="Danger Zone"
                      :accountId="accountId"
                      :nftId="id"
                      :collectionId="collectionId"
                      :attributes="nft.attributes" />
                    <Sharing class="mb-4" />
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
  </BaseGalleryItem>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { NFT, NFTMetadata, Emote } from '@/components/rmrk/service/scheme'
import {
  sanitizeIpfsUrl,
  resolveMedia,
  getSanitizer,
} from '@/components/rmrk/utils'
import { emptyObject } from '@/utils/empty'

import { notificationTypes, showNotification } from '@/utils/notification'
import {
  ClassMetadata,
  InstanceDetails,
  InstanceMetadata,
} from '@polkadot/types/interfaces'

import isShareMode from '@/utils/isShareMode'
import nftById from '@/queries/unique/nftById.graphql'
import { fetchNFTMetadata } from '@/components/rmrk/utils'
import { get, set } from 'idb-keyval'
import { MediaType } from '@/components/rmrk/types'
import axios from 'axios'
import Orientation from '@/utils/directives/DeviceOrientation'
import SubscribeMixin from '@/utils/mixins/subscribeMixin'
import Connector from '@kodadot1/sub-api'
import { Option } from '@polkadot/types'
import { createTokenId, tokenIdToRoute } from '../../utils'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import onApiConnect from '@/utils/api/general'

@Component<GalleryItem>({
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
  },
  directives: {
    orientation: Orientation,
  },
})
export default class GalleryItem extends mixins(SubscribeMixin, PrefixMixin) {
  private id = ''
  private collectionId = ''
  private nft: NFT = emptyObject<NFT>()
  private imageVisible = true
  public isLoading = false
  public mimeType = ''
  public meta: NFTMetadata = emptyObject<NFTMetadata>()
  public emotes: Emote[] = []
  public message = ''

  get accountId() {
    return this.$store.getters.getAuthAddress
  }

  get emoteVisible() {
    return this.urlPrefix === 'rmrk'
  }

  public async created() {
    this.checkId()
    this.fetchCollection()
    onApiConnect((api) => {
      this.loadMagic()
      if (api.query.uniques) {
        this.subscribe(
          api.query.uniques.asset,
          [this.collectionId, this.id],
          this.observeOwner
        )
      }
    })
  }

  protected observeOwner(data: Option<InstanceDetails>) {
    this.$consola.log(data.toHuman())
    const instance = data.unwrapOr(null)
    if (instance) {
      this.$set(this.nft, 'currentOwner', instance.owner.toHuman())
      this.$set(this.nft, 'delegate', instance.approved.toHuman())
      this.$set(this.nft, 'isFrozen', instance.isFrozen.isTrue)
    } else {
      // check if not burned because burned returns null
      this.nft = emptyObject<NFT>()
      this.$set(this.nft, 'burned', true)
    }
  }

  public async loadMagic() {
    const { api } = Connector.getInstance()
    await api?.isReady
    try {
      this.$consola.log('loading magic', this.id)
      const nftId = this.id || 0

      let nftQ = await api.query.uniques
        ?.instanceMetadataOf<Option<InstanceMetadata>>(this.collectionId, nftId)
        .then((res) => res.unwrapOr(null))

      if (!nftQ) {
        this.$consola.warn('nft with no metadata, trying collection')
        nftQ = await api.query.uniques
          ?.classMetadataOf<Option<ClassMetadata>>(this.collectionId)
          .then((res) => res.unwrapOr(null))
      }

      const nftData = nftQ?.toHuman()
      if (!nftData?.data) {
        this.$consola.warn(`No Metadata with ID ${nftId}`)
        // showNotification(`No Metadata with ID ${nftId}`, notificationTypes.warn)
        return
      }

      const nft = await fetchNFTMetadata({
        metadata: nftData.data.toString(),
      } as NFT)
      this.meta = {
        ...nft,
        image: sanitizeIpfsUrl(nft.image || ''),
        animation_url: sanitizeIpfsUrl(
          nft.animation_url || nft.image || '',
          'pinata'
        ),
      }
      // TODO: add attributes as traits
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { attributes, ...rest } = nft
      this.nft = {
        ...this.nft,
        ...rest,
        ...nftData,
      }

      this.fetchAnimationData()
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
      this.$consola.warn(e)
    }
    this.isLoading = false
  }

  private async fetchCollection() {
    const nft = await this.$apollo.query({
      query: nftById,
      client: this.urlPrefix,
      variables: {
        id: createTokenId(this.collectionId, this.id),
      },
    })
    const {
      data: { nFTEntity },
    } = nft

    if (!nFTEntity) {
      showNotification(`No NFT with ID ${this.id}`, notificationTypes.warn)
      return
    }

    this.$consola.log('nft', nFTEntity)

    this.nft = {
      ...this.nft,
      ...nFTEntity,
      metadata: nFTEntity.metadata || nFTEntity.collection.metadata,
    }
  }

  onImageError(e: any) {
    this.$consola.warn('Image error', e)
  }

  public async fetchAnimationData() {
    if (this.meta.animation_url && !this.mimeType) {
      const { headers } = await axios.head(this.meta.animation_url)
      this.mimeType = headers['content-type']
      this.$consola.log(this.mimeType)
      const mediaType = resolveMedia(this.mimeType)
      this.imageVisible = ![
        MediaType.VIDEO,
        MediaType.MODEL,
        MediaType.IFRAME,
        MediaType.OBJECT,
      ].some((t) => t === mediaType)
    }
  }

  public async fetchMetadata() {
    // this.$consola.log(this.nft);

    if (this.nft['metadata'] && !this.meta['image']) {
      const m = await get(this.nft.metadata)

      const meta = m
        ? m
        : await fetchNFTMetadata(
            this.nft,
            getSanitizer(this.nft.metadata, undefined, 'permafrost')
          )
      this.$consola.log(meta)

      const imageSanitizer = getSanitizer(meta.image)
      this.meta = {
        ...meta,
        image: imageSanitizer(meta.image),
        animation_url: sanitizeIpfsUrl(
          meta.animation_url || meta.image,
          'pinata'
        ),
      }

      this.$consola.log(this.meta)
      if (this.meta.animation_url && !this.mimeType) {
        const { headers } = await axios.head(this.meta.animation_url)
        this.mimeType = headers['content-type']
        this.$consola.log(this.mimeType)
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
      const { id, item } = tokenIdToRoute(this.$route.params.id)
      this.id = item
      this.collectionId = id
    }
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message)
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

  protected handleAction(deleted: boolean) {
    if (deleted) {
      showNotification('INSTANCE REMOVED', notificationTypes.warn)
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
</style>
