<template>
  <div
    class="card nft-card"
    :class="{ 'is-current-owner': accountIsCurrentOwner() }"
  >
    <LinkResolver
      class="nft-card__skeleton"
      :route="type"
      :param="id"
      :link="link"
      tag="a"
    >
      <div class="card-image" v-if="image">
        <span v-if="emoteCount" class="card-image__emotes">
          <b-icon icon="heart" />
          <span class="card-image__emotes__count">{{ emoteCount }}</span>
        </span>
        <BasicImage :src="image" :alt="title" customClass="gallery__image-wrapper" />
        <span v-if="price > 0" class="card-image__price">
          <Money :value="price" inline />
        </span>
      </div>

      <div v-else class="card-image">
        <span v-if="emoteCount" class="card-image__emotes">
          <b-icon icon="heart" />
          <span class="card-image__emotes__count">{{ emoteCount }}</span>
        </span>

        <b-image :src="placeholder" alt="Simple image" ratio="1by1"></b-image>

        <span v-if="price > 0" class="card-image__price">
          <Money :value="price" inline />
        </span>
      </div>

      <div class="card-content">
        <div class="title is-6 is-size-4-mobile has-text-primary has-text-centered has-text-overflow-ellipsis">
          {{ name }}
        </div>
      </div>
    </LinkResolver>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { get, update } from 'idb-keyval'
import shouldUpdate from '@/utils/shouldUpdate'
import { fetchNFTMetadata, getSanitizer } from '../utils'
import { NFT } from '../service/scheme'

const components = {
  LinkResolver: () => import('@/components/shared/LinkResolver.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
}

@Component({ components })
export default class GalleryCard extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
  @Prop() public id!: string;
  @Prop() public name!: string;
  protected image = '';
  protected title = '';
  @Prop() public emoteCount!: string | number;
  @Prop() public imageType!: string;
  @Prop() public price!: string;
  @Prop() public metadata!: string;
  @Prop() public currentOwner!: string;

  private placeholder = '/koda300x300.svg';

  async mounted() {
    if (this.metadata) {
      const meta = await get(this.metadata)
      if (meta) {
        this.image = getSanitizer(meta.image || '')(meta.image || '')
        this.title = meta.name
      } else {
        const m = await fetchNFTMetadata(
          { metadata: this.metadata } as NFT,
          getSanitizer(this.metadata, undefined, 'permafrost')
        )
        this.image = getSanitizer(m.image || '')(m.image || '')
        this.title = m.name
        update(this.metadata, () => m)
      }
    }
  }

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      this.accountIsCurrentOwner()
    }
  }

  get accountId(): string {
    return this.$store.getters.getAuthAddress
  }

  public accountIsCurrentOwner() {
    return this.accountId === this.currentOwner
  }
}
</script>

<style lang="scss">
.nft-card {
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 2px 5px 0.5px #d32e79;

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
    .ff-canvas {
      border-radius: 8px;
    }
    transition: all 0.3s;

    .card-image {
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
// Cards Layout
.is-one-fifth-desktop.is-one-quarter-tablet .nft-card .title {
  font-size: .75rem;
}
</style>
