<template>
  <section class="curated-list">
    <b-carousel
      animated="fade"
      :interval="5000"
      :pause-hover="true"
      :has-drag="true"
      :indicator="true"
      :indicator-inside="false"
      :indicator-background="false"
      indicator-mode="click"
      indicator-position="is-bottom"
      indicator-style="is-lines"
      data-cy="curated-list">
      <b-carousel-item
        v-for="(collection, i) in collections"
        :key="`${collection.image}-${i}`">
        <BasicImage :src="collection.image" :alt="collection.name" />
        <div class="box">
          <div class="content has-text-left">
            <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
              <h2 class="title is-5" data-cy="curated-name">
                {{ collection.name }}
              </h2>
            </nuxt-link>
            <nuxt-link :to="`/${urlPrefix}/u/${collection.issuer}`">
              <div class="is-size-7 icon-text">
                <NeoIcon icon="palette" />
                <Identity
                  :address="collection.issuer"
                  class="force-clip is-ellipsis" />
              </div>
            </nuxt-link>
          </div>
        </div>
      </b-carousel-item>
    </b-carousel>
  </section>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'

import useCarouselSpotlight from '@/components/carousel/utils/useCarouselSpotlight'

const { collections } = useCarouselSpotlight()
const { urlPrefix } = usePrefix()
</script>

<style lang="scss">
// move to scss component
@import '@/styles/abstracts/variables';

.curated-list {
  .carousel,
  .carousel-item {
    max-height: 500px;
    border-radius: 4px;
  }

  .carousel-indicator {
    justify-content: left;

    .indicator-style.is-lines {
      height: 18px !important;
      width: 42px !important;
      background-color: #c4c4c4;
      border: inherit;
    }
  }

  .box {
    position: absolute;
    border-radius: 4px;
    background-color: rgba(9, 9, 9, 0.77);
    width: 40%;
    bottom: 2%;
    right: 2%;

    @include touch {
      width: 65%;
    }
  }
}
</style>
