<template>
  <b-carousel-list :data="nfts" :items-to-show="4">
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
              <p class="title is-4">
                <nuxt-link :to="`/rmrk/gallery/${list.id}`">
                  {{ list.name }}
                </nuxt-link>
              </p>
              <p class="subtitle is-6">
                <nuxt-link
                  :to="{ name: 'rmrk-u-id', params: { id: list.issuer } }">
                  <!-- <Avatar :size="12" :value="list.issuer" /> -->
                  <Identity :address="list.issuer" inline noOverflow />
                </nuxt-link>
              </p>
            </div>
          </div>

          <b-field grouped>
            <span>
              <Money :value="list.price" inline />
            </span>
            <p class="control ml-auto">
              <b-button
                size="is-small"
                type="is-success"
                icon-left="money-bill-wave"
                outlined />
            </p>
          </b-field>
        </div>
      </div>
    </template>
  </b-carousel-list>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import 'lazysizes'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
}

@Component<CarouselList>({
  components,
})
export default class CarouselList extends Vue {
  @Prop({ required: true }) nfts!: any[]

  async created() {
    console.log(this.nfts)
  }
}
</script>

<style lang="scss" scoped>
.card {
  border-radius: 8px;
  border: 2px solid #d32e79;
}
</style>
