<template>
  <b-carousel-list
    v-model="page"
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
            <BasicImage :src="list.image" :alt="list.name" />
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
              <div class="is-size-7">
                <nuxt-link
                  :to="{ name: 'rmrk-u-id', params: { id: list.issuer } }">
                  <b-icon icon="palette" />
                  <!-- <Identicon
                    :size="18"
                    :theme="'polkadot'"
                    :value="list.issuer"
                    class="mr-2" /> -->
                  <Identity :address="list.issuer" inline noOverflow />
                </nuxt-link>
              </div>
              <div class="is-size-7">
                <nuxt-link
                  :to="{
                    name: 'rmrk-u-id',
                    params: { id: list.currentOwner },
                  }">
                  <b-icon icon="money-bill-alt" />
                  <Identity :address="list.currentOwner" inline noOverflow />
                </nuxt-link>
              </div>
            </div>
          </div>

          <b-field grouped>
            <span>
              <Appreciation :accountId="accountId" :nftId="list.id" />
            </span>
            <p class="control ml-auto" v-if="list.price">
              <Money :value="list.price" inline />
            </p>
          </b-field>

          <time class="is-size-7 icon-text">
            <b-icon icon="clock" />
            <span>{{ list.timestamp }}</span>
          </time>
        </div>
      </div>
    </template>
  </b-carousel-list>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
// import Identicon from '@polkadot/vue-identicon'
import AuthMixin from '@/utils/mixins/authMixin'

const components = {
  // Identicon,
  Loader: () => import('@/components/shared/Loader.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  Appreciation: () => import('@/components/rmrk/Gallery/Appreciation.vue'),
}

@Component<CarouselList>({
  components,
})
export default class CarouselList extends mixins(AuthMixin) {
  @Prop({ required: true }) nfts!: any[] // mising type
  @Prop({ required: true }) page!: number

  created() {
    console.log(this.nfts)
  }
  get options() {
    return {
      itemsToShow: 2,
      breakpoints: {
        300: {
          itemsToShow: 1,
        },
        500: {
          itemsToShow: 2,
        },
        768: {
          itemsToShow: 3.5,
        },
        1200: {
          itemsToShow: 4.5,
        },
      },
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.carousel-card-list {
  overflow: inherit;
  mask: linear-gradient(90deg, rgb(255, 255, 255) 45%, transparent);
}

.card {
  border-radius: 8px;
  border: 2px solid $primary;

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
</style>
