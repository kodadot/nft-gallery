<template>
  <b-carousel-list
    :value="current"
    has-drag
    :arrow="false"
    :arrow-hover="false"
    :data="nfts"
    :items-to-show="options.itemsToShow"
    :breakpoints="options.breakpoints"
    class="carousel-card-list">
    <template #item="list">
      <div class="card mx-2">
        <div class="card-image p-4">
          <nuxt-link :to="urlOf(list.id)">
            <PreviewMediaResolver
              v-if="list.animationUrl"
              :src="list.animationUrl"
              :poster="list.image || ''"
              :metadata="list.metadata" />
            <BasicImage
              v-else
              :src="list.image"
              :alt="list.name"
              custom-class="carousel__image-wrapper" />
          </nuxt-link>
        </div>
        <div class="card-content px-4">
          <div class="media">
            <div class="media-content">
              <div class="title is-5 is-ellipsis has-text-weight-bold">
                <nuxt-link :to="urlOf(list.id)">
                  {{ list.name }}
                </nuxt-link>
              </div>
              <div v-if="list.collection" class="subtitle is-6 is-ellipsis">
                <nuxt-link :to="`/rmrk/collection/${list.collection.id}`">
                  {{ list.collection.name }}
                </nuxt-link>
              </div>
              <nuxt-link
                :to="{ name: profileUrl, params: { id: list.issuer } }">
                <div class="is-size-7 icon-text">
                  <b-icon icon="palette" />
                  <Identity
                    :address="list.issuer"
                    inline
                    no-owerlow
                    class="force-clip is-ellipsis" />
                </div>
              </nuxt-link>
              <nuxt-link
                v-if="list.currentOwner"
                :to="{
                  name: profileUrl,
                  params: { id: list.currentOwner },
                }"
                data-cy="current-owner">
                <div class="is-size-7 icon-text">
                  <b-icon icon="money-bill-alt" />
                  <Identity
                    :address="list.currentOwner"
                    inline
                    no-overflow
                    class="force-clip is-ellipsis" />
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
        <div v-show="list.timestamp || list.price" class="card-footer">
          <div class="is-flex p-2">
            <time v-if="list.timestamp" class="is-size-7 icon-text">
              <b-icon icon="clock" />
              <span>{{ list.timestamp }}</span>
            </time>
            <div v-if="list.price" class="ml-auto">
              <Money :value="list.price" inline />
            </div>
          </div>
        </div>
      </div>
    </template>
  </b-carousel-list>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'

import AuthMixin from '@/utils/mixins/authMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import type { CarouselNFT } from './types'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
  Identity: () => import('@/components/shared/identity/IdentityIndex.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  PreviewMediaResolver: () =>
    import('@/components/media/PreviewMediaResolver.vue'),
}

@Component<CarouselList>({
  components,
})
export default class CarouselList extends mixins(AuthMixin, PrefixMixin) {
  @Prop({ type: Array, required: true }) nfts!: CarouselNFT[]
  @Prop({ type: Number, default: 1 }) page!: number
  @Prop({ type: String, default: 'gallery' }) url!: string
  get current() {
    return this.page - 1 // 0-indexed
  }

  get profileUrl() {
    return `${this.urlPrefix}-u-id`
  }

  public urlOf(id: string): string {
    return `/${this.urlPrefix}/${this.url}/${id}`
  }

  get options() {
    return {
      itemsToShow: 2,
      breakpoints: {
        300: {
          itemsToShow: 1,
        },
        600: {
          itemsToShow: 1.5,
        },
        800: {
          itemsToShow: 2,
        },
        900: {
          itemsToShow: 2.5,
        },
        1000: {
          itemsToShow: 3,
        },
        1400: {
          itemsToShow: 4,
        },
        1800: {
          itemsToShow: 5,
        },
      },
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.carousel-card-list {
  overflow-x: auto;
  mask: linear-gradient(90deg, rgb(255, 255, 255) 75%, transparent);
  &::-webkit-scrollbar {
    /* Hide scrollbar for Chrome, Safari and Opera */
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.card {
  background-color: #0e0e10;
  .media-content {
    width: 100%;
  }
  .card-image {
    overflow: hidden;
    figure {
      transition: transform 0.2s;
    }
    figure:hover {
      transform: scale(1.1);
    }
  }
  .card-footer {
    border-top-color: hsla(0, 0%, 60%, 1);
    .is-flex {
      flex: auto;
    }
  }
}
</style>
