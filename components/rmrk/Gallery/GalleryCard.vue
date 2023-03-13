<template>
  <div class="card nft-card">
    <LinkResolver
      class="nft-card__skeleton"
      :route="route"
      :link="link"
      :param="id"
      tag="a">
      <div class="card-image">
        <span v-if="emoteCount" class="card-image__emotes">
          <b-icon icon="heart" />
          <span class="card-image__emotes__count">{{ emoteCount }}</span>
        </span>
        <BasicImage
          v-if="isBasicImage"
          :src="image"
          :alt="title"
          custom-class="gallery__image-wrapper" />
        <PreviewMediaResolver
          v-else
          :src="animatedUrl"
          :metadata="metadata"
          :mime-type="mimeType" />
        <span
          v-if="parseInt(price) > 0 && showPriceValue"
          class="card-image__price">
          <CommonTokenMoney :value="price" inline />
        </span>
      </div>

      <div v-if="!hideName" class="card-content">
        <span
          class="has-text-centered has-text-primary"
          :class="{ 'title is-4': largeDisplay }"
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
import { Component, Prop, mixins } from 'nuxt-property-decorator'

import { processSingleMetadata } from '@/utils/cachingStrategy'
import AuthMixin from '@/utils/mixins/authMixin'

import { getMimeType } from '@/utils/gallery/media'
import { getSanitizer, sanitizeIpfsUrl } from '@/utils/ipfs'
import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { usePreferencesStore } from '@/stores/preferences'

const components = {
  LinkResolver: () => import('@/components/shared/LinkResolver.vue'),
  CommonTokenMoney: () => import('@/components/shared/CommonTokenMoney.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  PreviewMediaResolver: () =>
    import('@/components/media/PreviewMediaResolver.vue'),
}

@Component({ components })
export default class GalleryCard extends mixins(AuthMixin) {
  @Prop({ type: String, default: '/rmrk/gallery' })
  public route!: string
  @Prop({ type: String, default: 'rmrk/gallery' })
  public link!: string
  @Prop(String) public id!: string
  @Prop(String) public name!: string
  @Prop([String, Number]) public emoteCount!: string | number
  @Prop(String) public imageType!: string
  @Prop(String) public price!: string
  @Prop(String) public metadata!: string
  @Prop(String) public currentOwner!: string
  @Prop(Boolean) public listed!: boolean
  @Prop(Boolean) public hideName!: boolean
  public image = ''
  public title = ''
  public animatedUrl = ''
  public mimeType = ''
  private preferencesStore = usePreferencesStore()

  async fetch() {
    if (this.metadata) {
      const meta = await processSingleMetadata<NFTMetadata>(this.metadata)

      this.image = getSanitizer(meta.image || '', 'image')(meta.image || '')
      this.title = meta.name
      this.animatedUrl = sanitizeIpfsUrl(
        meta.animation_url || meta.mediaUri || '',
        'image'
      )
      this.mimeType = (await getMimeType(this.animatedUrl || this.image)) || ''
    }
  }

  get isBasicImage() {
    return !this.animatedUrl || (this.image && this.mimeType.includes('audio'))
  }

  get showPriceValue(): boolean {
    return this.listed || this.preferencesStore.getShowPriceValue
  }

  get nftName(): string {
    return this.name || this.title || '--'
  }

  get largeDisplay(): boolean {
    return (
      this.preferencesStore.getLayoutClass === 'is-half-desktop is-half-tablet'
    )
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.nft-card {
  position: relative;
  overflow: hidden;
  border-radius: 0px !important;

  .has-text-overflow-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    @include ktheme() {
      color: theme('white');
    }
  }

  &__skeleton {
    transition: all 0.3s;

    .card-image {
      &__emotes {
        position: absolute;
        border-radius: 4px;
        padding: 3px 8px;
        top: 10px;
        right: 10px;
        font-size: 14px;
        z-index: 3;
        transition: all 0.3s;

        @include ktheme() {
          color: theme('white');
          background: theme('k-primary');
        }
      }

      &__price {
        position: absolute;
        border-radius: 4px;
        padding: 3px 8px;
        bottom: 10px;
        left: 10px;
        font-size: 14px;
        z-index: 3;
        transition: all 0.3s ease;

        @include ktheme() {
          background: theme('k-shade');
          color: theme('white');
        }
      }
    }
  }

  .card-image__emotes__count {
    vertical-align: text-bottom;
  }

  .card-content {
    border-radius: 0;
  }

  @media screen and (min-width: 1024px) {
    .card-content {
      position: absolute;
      bottom: -45px;
      left: 0;
      width: 100%;
      opacity: 0;

      @include ktheme() {
        background: theme('background-color');
      }
    }

    .card-image img {
      transition: all 0.3s ease;
    }

    &:hover .card-content {
      bottom: 0;
      opacity: 1;
      z-index: 2;
      background: $frosted-glass-background;
      backdrop-filter: $frosted-glass-backdrop-filter;
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

<style lang="scss">
.gallery__image-wrapper img {
  border-radius: 0px !important;
}
</style>
