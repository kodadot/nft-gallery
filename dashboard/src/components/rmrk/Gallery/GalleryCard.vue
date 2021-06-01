<template>
  <div class="card nft-card">
    <LinkResolver class="nft-card__skeleton" :route="type" :param="id" :link="link" tag="div" >
      <div class="card-image" v-if="image">
        <b-image
          :src="image"
          :src-fallback="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
          alt="Simple image"
          ratio="1by1"
        ></b-image>
      </div>

      <div v-else class="card-image">
        <b-image
          :src="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
          alt="Simple image"
          ratio="1by1"
        ></b-image>
      </div>

      <div class="card-content">
        <span class="title mb-0 is-4 has-text-centered has-text-primary" :title="name">
          <div class="has-text-overflow-ellipsis">
            {{ name }}
          </div>
        </span>
      </div>
    </LinkResolver>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';
import { get, update } from 'idb-keyval';
import { sanitizeIpfsUrl, fetchNFTMetadata } from '../utils';
import { NFT } from '../service/scheme';

const components = {
  LinkResolver: () => import('@/components/shared/LinkResolver.vue')
};

@Component({ components })
export default class GalleryCard extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
  @Prop() public id!: string;
  @Prop() public name!: string;
  protected image: string = '';
  @Prop() public emoteCount!: string | number;
  @Prop() public imageType!: string;
  @Prop() public price!: string;
  @Prop() public metadata!: string;

  private placeholder = require('@/assets/kodadot_logo_v1_transparent_400px.png');

  async mounted() {
    if (this.metadata) {
      const meta = await get(this.metadata);
      if (meta) {
        this.image = sanitizeIpfsUrl(meta.image)
      } else {
        const m = await fetchNFTMetadata({ metadata: this.metadata } as NFT)
        this.image = sanitizeIpfsUrl(m.image || '')
        console.log(this.image, this.metadata);
        update(this.metadata, () => m)
      }
    }
  }
}
</script>

<style lang="scss">
.gallery {
  @media screen and (max-width: 1023px) {
    padding: 0 15px;
  }

  &__image-wrapper {
    position: relative;
    margin: auto;
    padding-top: 100%;
    overflow: hidden;
    cursor: pointer;
  }

  &__image {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    border-radius: 8px;
    top: 50%;
    transition: all 0.3s;
    display: block;
    width: 100%;
    height: auto;
    transform: scale(1) translateY(-50%);
  }

  .ff-container {
    position: absolute;
    top: 0;
    height: 100%;
    overflow: hidden;

    .ff-overlay {
      z-index: 2;
    }

    .ff-image,
    .ff-canvas {
      top: 50%;
      height: auto;
      transform: translateY(-50%);
      transition: all 0.3s !important;
    }
  }

  .has-text-overflow-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .is-float-right {
    float: right;
  }

  .is-color-pink {
    color: #d32e79;
  }

  .is-absolute {
    position: absolute;
  }

  .nft-collection-counter {
    top: 5px;
    right: -5px;
  }

  .columns {
    padding-top: 10px;

    .card {
      border-radius: 8px;
      position: relative;
      overflow: hidden;

      &-image {
        .ff-canvas {
          border-radius: 8px;
        }

        &__emotes {
          position: absolute;
          background-color: #d32e79;
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
          background-color: #363636;
          border-radius: 4px;
          padding: 3px 8px;
          color: #fff;
          bottom: 10px;
          left: 10px;
          font-size: 14px;
          z-index: 3;
          transition: all 0.3s;
        }
      }

      @media screen and (min-width: 1024px) {
        &-content {
          position: absolute;
          bottom: -45px;
          left: 0;
          width: 100%;
          transition: all 0.3s;
          background: #fff;
          opacity: 0;
        }

        &:hover .card-content {
          bottom: 0;
          opacity: 1;
          z-index: 2;
        }

        &:hover .gallery__image-wrapper img {
          transform: scale(1.1) translateY(-50%);
        }

        &:hover .ff-canvas {
          transform: scale(1.1) translateY(-50%);
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
  }
}
</style>
