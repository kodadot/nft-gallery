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
      <div class="card mx-4">
        <div class="card-image">
          <nuxt-link :to="`/rmrk/gallery/${list.id}`">
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
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <div class="title is-5 is-ellipsis">
                <nuxt-link :to="`/rmrk/gallery/${list.id}`">
                  {{ list.name }}
                </nuxt-link>
              </div>
              <b-field grouped>
                <p class="control ml-auto" v-if="list.price">
                  <Money :value="list.price" inline />
                </p>
              </b-field>
              <nuxt-link
                :to="{ name: 'rmrk-u-id', params: { id: list.issuer } }">
                <div class="is-size-7 icon-text">
                  <b-icon icon="palette" />
                  <Identity
                    :address="list.issuer"
                    inline
                    noOwerlow
                    class="force-clip is-ellipsis" />
                </div>
              </nuxt-link>
              <nuxt-link
                v-if="list.currentOwner"
                :to="{
                  name: 'rmrk-u-id',
                  params: { id: list.currentOwner },
                }">
                <div class="is-size-7 icon-text">
                  <b-icon icon="money-bill-alt" />
                  <Identity
                    :address="list.currentOwner"
                    inline
                    noOverflow
                    class="force-clip is-ellipsis" />
                </div>
              </nuxt-link>
              <time class="is-size-7 icon-text">
                <b-icon icon="clock" />
                <span>{{ list.timestamp }}</span>
              </time>
            </div>
          </div>
        </div>
      </div>
    </template>
  </b-carousel-list>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import AuthMixin from '@/utils/mixins/authMixin'

import type { CarouselNFT } from './types'

const components = {
  // Identicon,
  Loader: () => import('@/components/shared/Loader.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  Appreciation: () => import('@/components/rmrk/Gallery/Appreciation.vue'),
  PreviewMediaResolver: () =>
    import('@/components/rmrk/Media/PreviewMediaResolver.vue'),
}

@Component<CarouselList>({
  components,
})
export default class CarouselList extends mixins(AuthMixin) {
  @Prop({ type: Array, required: true }) nfts!: CarouselNFT[]
  @Prop({ type: Number, default: 1 }) page!: number

  get current() {
    return this.page - 1 // 0-indexed
  }

  get options() {
    return {
      itemsToShow: 2,
      breakpoints: {
        300: {
          itemsToShow: 1,
        },
        600: {
          itemsToShow: 2,
        },
        800: {
          itemsToShow: 2.5,
        },
        900: {
          itemsToShow: 3,
        },
        1000: {
          itemsToShow: 3.5,
        },
        1200: {
          itemsToShow: 4,
        },
        1400: {
          itemsToShow: 4.5,
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
  .media-content {
    width: 100%;
  }
}

/* move to global */
.is-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.force-clip {
  max-width: 85%;
  max-height: 24px;
}

.card-image {
  overflow: hidden;
}
</style>

<style lang="scss">
.card {
  &:hover .carousel__image-wrapper img {
    transform: scale(1.1);
    transition: transform 0.3s linear;
  }
  .carousel__image-wrapper img {
    transition: all 0.3s;
  }
}
</style>
