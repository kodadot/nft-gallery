<template>
  <BaseGalleryItem
    :image="meta.image"
    :animation-url="meta.animation_url"
    :description="meta.description"
    :image-visible="imageVisible"
    :is-loading="isLoading">
    <template v-if="message" #top>
      <b-message class="message-box" type="is-primary">
        <MessageNotify
          :enable-download="isOwner"
          :title="$t('mint.success') + ' 🎉'"
          :subtitle="$t('mint.shareWithFriends', [nft.name]) + ' △'" />
      </b-message>
    </template>
    <template #main>
      <div class="columns">
        <div class="column is-6">
          <div class="nft-title">
            <Name :nft="nft" :is-loading="isLoading" />
          </div>

          <div v-if="meta.description" class="block">
            <p class="label">{{ $t('legend') }}</p>
            <VueMarkdown
              v-if="!isLoading"
              class="is-size-5"
              :style="{ wordBreak: 'break-word' }"
              :source="meta.description.replaceAll('\n', '  \n')" />
            <b-skeleton
              :count="3"
              size="is-large"
              :active="isLoading"></b-skeleton>
          </div>

          <div v-if="nft.attributes && nft.attributes.length" class="block">
            <Properties :attributes="nft.attributes" />
          </div>
        </div>

        <div v-if="detailVisible" class="column is-6">
          <b-skeleton
            :count="2"
            size="is-large"
            :active="isLoading"></b-skeleton>

          <div class="columns">
            <div class="column">
              <div class="nft-title">
                <Detail :nft="nft" :is-loading="isLoading" />
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
                        <AvailableActions
                          ref="actions"
                          :account-id="accountId"
                          :is-owner="isOwner"
                          :current-owner-id="nft.currentOwner"
                          :price="nft.price"
                          :nft-id="id"
                          :delegate-id="nft.delegate"
                          :collection-id="collectionId"
                          :frozen="nft.isFrozen"
                          :ipfs-hashes="[
                            nft.image,
                            nft.animation_url,
                            nft.metadata,
                          ]"
                          @change="handleAction" />
                        <Auth />
                      </p>
                    </div>
                    <DangerModal
                      v-if="accountId === nft.currentOwner"
                      title="Danger Zone"
                      :account-id="accountId"
                      :nft-id="id"
                      :collection-id="collectionId"
                      :attributes="nft.attributes" />
                    <Sharing :enable-download="isOwner" class="mb-4" />
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
import { Emote, NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import {
  getSanitizer,
  resolveMedia,
  sanitizeIpfsUrl,
} from '@/components/rmrk/utils'
import { isOwner } from '~/utils/account'
import { emptyObject } from '@/utils/empty'
import { Component, mixins } from 'nuxt-property-decorator'

import { notificationTypes, showNotification } from '@/utils/notification'
import {
  ClassMetadata,
  InstanceDetails,
  InstanceMetadata,
} from '@polkadot/types/interfaces'

import { MediaType } from '@/components/rmrk/types'
import { fetchNFTMetadata } from '@/components/rmrk/utils'
import nftById from '@/queries/unique/nftById.graphql'
import Orientation from '@/utils/directives/DeviceOrientation'
import isShareMode from '@/utils/isShareMode'
import SubscribeMixin from '@/utils/mixins/subscribeMixin'
import { onApiConnect } from '@kodadot1/sub-api'
import { Option } from '@polkadot/types'
import axios from 'axios'
import { get, set } from 'idb-keyval'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import UseApiMixin from '~/utils/mixins/useApiMixin'
import { createTokenId, tokenIdToRoute } from '../../utils'
import AuthMixin from '~/utils/mixins/authMixin'

@Component<GalleryItem>({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    AvailableActions: () => import('./AvailableActions.vue'),
    Name: () => import('@/components/rmrk/Gallery/Item/Name.vue'),
    Sharing: () => import('@/components/shared/Sharing.vue'),
    VueMarkdown: () => import('vue-markdown-render'),
    Detail: () => import('@/components/unique/Gallery/Item/Detail.vue'),
    DangerModal: () =>
      import('@/components/unique/Gallery/Item/DangerModal.vue'),
    Properties: () => import('@/components/shared/gallery/Properties.vue'),
    BaseGalleryItem: () =>
      import('@/components/shared/gallery/BaseGalleryItem.vue'),
  },
  directives: {
    orientation: Orientation,
  },
})
export default class GalleryItem extends mixins(
  SubscribeMixin,
  PrefixMixin,
  AuthMixin,
  UseApiMixin
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

  get emoteVisible() {
    return this.urlPrefix === 'rmrk'
  }

  get isOwner(): boolean {
    return isOwner(this.nft.currentOwner, this.accountId)
  }

  public async created() {
    this.checkId()
    this.fetchCollection()
    onApiConnect(this.apiUrl, (api) => {
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
    const api = await this.useApi()
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
