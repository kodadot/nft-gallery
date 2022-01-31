<template>
  <div
    class="card nft-card"
    :class="{ 'is-current-owner': accountIsCurrentOwner() }">
    <LinkResolver
      class="nft-card__skeleton"
      :route="route"
      :link="link"
      :param="id"
      tag="a">
      <div v-if="image" class="card-image">
        <span v-if="emoteCount" class="card-image__emotes">
          <b-icon icon="heart" />
          <span class="card-image__emotes__count">{{ emoteCount }}</span>
        </span>
        <BasicImage
          :src="image"
          :alt="title"
          custom-class="gallery__image-wrapper" />
        <span v-if="price > 0 && showPriceValue" class="card-image__price">
          <Money :value="price" inline />
        </span>
      </div>

      <div v-else class="card-image">
        <span v-if="emoteCount" class="card-image__emotes">
          <b-icon icon="heart" />
          <span class="card-image__emotes__count">{{ emoteCount }}</span>
        </span>

        <b-image :src="placeholder" alt="Simple image" ratio="1by1" />

        <span v-if="price > 0" class="card-image__price">
          <Money :value="price" inline />
        </span>
      </div>

      <div class="card-content">
        <span
          class="title mb-0 is-4 has-text-centered has-text-primary"
          :title="name">
          <div class="has-text-overflow-ellipsis">
            {{ nftName }}
          </div>
        </span>
      </div>
    </LinkResolver>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import AuthMixin from '@/utils/mixins/authMixin'
import shouldUpdate from '@/utils/shouldUpdate'
import {
  getSingleCloudflareImage,
  processSingleMetadata,
} from '@/utils/cachingStrategy'

import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { getSanitizer } from '@/components/rmrk/utils'

const components = {
  LinkResolver: () => import('@/components/shared/LinkResolver.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  PreviewMediaResolver: () =>
    import('@/components/rmrk/Media/PreviewMediaResolver.vue'),
}

@Component({ components })
export default class GalleryCard extends mixins(AuthMixin) {
  @Prop({ type: String, default: '/rmrk/gallery' }) public route!: string
  @Prop({ type: String, default: 'rmrk/gallery' }) public link!: string
  @Prop(String) public id!: string
  @Prop(String) public name!: string
  protected image = ''
  protected title = ''
  protected animatedUrl = ''
  @Prop([String, Number]) public emoteCount!: string | number
  @Prop(String) public imageType!: string
  @Prop(String) public price!: string
  @Prop(String) public metadata!: string
  @Prop(String) public currentOwner!: string
  @Prop(Boolean) public listed!: boolean

  protected placeholder = '/placeholder.webp'

  async mounted() {
    if (this.metadata) {
      const metaP = processSingleMetadata<NFTMetadata>(this.metadata)
      const image = await getSingleCloudflareImage(this.metadata)
      const meta = await metaP

      this.image = image || getSanitizer(meta.image || '')(meta.image || '')
      this.title = meta.name
      this.animatedUrl = meta.animation_url || ''
    }
  }

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      this.accountIsCurrentOwner()
    }
  }

  get showPriceValue(): boolean {
    return this.listed || this.$store.getters['preferences/getShowPriceValue']
  }

  get nftName(): string {
    return this.name || this.title
  }

  public accountIsCurrentOwner() {
    return this.accountId === this.currentOwner
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.nft-card {
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  border: 2px solid $primary-light;

  &.is-current-owner {
    box-shadow: 0px 2px 5px 0.5px #41b883;
  }

  .has-text-overflow-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
  }

  &__skeleton {
    transition: all 0.3s;

    .card-image {
      &__emotes {
        position: absolute;
        background-color: $primary-light;
        border-radius: 4px;
        padding: 3px 8px;
        color: #fff;
        top: 10px;
        right: 10px;
        font-size: 14px;
        z-index: 3;
        transition: all 0.3s;
      }

      &__price {
        position: absolute;
        background-color: $grey-darker;
        border-radius: 4px;
        padding: 3px 8px;
        color: #fff;
        bottom: 10px;
        left: 10px;
        font-size: 14px;
        z-index: 3;
        transition: all 0.3s ease;
      }
    }
  }

  .card-image__emotes__count {
    vertical-align: text-bottom;
  }

  @media screen and (min-width: 1024px) {
    .card-content {
      position: absolute;
      bottom: -45px;
      left: 0;
      width: 100%;
      background: #fff;
      opacity: 0;
    }

    .card-image img {
      transition: all 0.3s ease;
    }

    &:hover .card-content {
      bottom: 0;
      opacity: 1;
      z-index: 2;
      background: #000 !important;
    }

    &:hover .card-image img {
      transform: scale(1.1) translateY(-5%);
    }

    &:hover .card-image__emotes {
      top: 15px;
      right: 15px;
    }

    &:hover .card-image__price {
      bottom: 62px;
    }
  }
}
</style>
