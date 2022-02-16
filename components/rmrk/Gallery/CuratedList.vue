<template>
  <section class="curated-list">
    <b-carousel
      :indicator="true"
      :indicator-background="false"
      :indicator-inside="false"
      indicator-mode="click"
      indicator-position="is-bottom"
      indicator-style="is-lines">
      <b-carousel-item v-for="(collection, i) in collections" :key="i">
        <b-image class="image" :src="collection.image"></b-image>
        <div class="box">
          <div class="content">
            <h2 class="title is-5">{{ collection.name }}</h2>
            <!-- <div class="my-2">{{ collection.description }}</div> -->
            <nuxt-link
              :to="{ name: 'rmrk-u-id', params: { id: collection.issuer } }">
              <div class="is-size-7 icon-text">
                <b-icon icon="palette" />
                <!-- DVYy1qnocE8t6ZvUfPx3rEjG829khNRXx3YrCGVHHj19Lcb -->
                <Identity
                  :address="collection.issuer"
                  inline
                  noOwerlow
                  class="force-clip is-ellipsis" />
              </div>
            </nuxt-link>
          </div>
        </div>
      </b-carousel-item>
    </b-carousel>
  </section>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
// import Identicon from '@polkadot/vue-identicon'
import AuthMixin from '@/utils/mixins/authMixin'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'
import collectionCuratedList from '@/queries/rmrk/subsquid/collectionCuratedList.graphql'

const components = {
  // Identicon,
  // Loader: () => import('@/components/shared/Loader.vue'),
  // Money: () => import('@/components/shared/format/Money.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
  // BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  // Appreciation: () => import('@/components/rmrk/Gallery/Appreciation.vue'),
}

const curatedCollection = [
  '800f8a914281765a7d-KITTY', // kitty
  'fc71e5776756c96a50-🛸GUYFROMMARS', // guyfrommars
  '160a6f4320f11acb25-LCKWV', // pixelbabe
  '2644199cf3652aaa78-KK01', // kusamakings
]

@Component<CuratedList>({
  components,
})
export default class CuratedList extends mixins(AuthMixin) {
  private collections: [] = []
  async fetch() {
    const result = await this.$apollo
      .query<any>({
        query: collectionCuratedList,
        client: 'subsquid',
        variables: {
          list: curatedCollection,
        },
      })
      .catch((e) => {
        console.error(e)
        return { data: null }
      })

    if (result.data) {
      await this.handleResult(result)
    }
  }

  protected async handleResult({ data }: any) {
    console.log(data)
    const images = await getCloudflareImageLinks(
      data.collectionEntities.map((e: any) => e.meta.id)
    )
    const imageOf = getProperImageLink(images)
    this.collections = data.collectionEntities.map((e: any) => ({
      ...e,
      image: imageOf(e.meta.id, e.meta.image),
    }))
    console.log(this.collections)
  }
}
</script>

<style lang="scss">
.curated-list {
  .carousel,
  .carousel-item {
    max-height: 500px;
  }
  .carousel-indicator {
    justify-content: left;

    .indicator-style.is-lines {
      height: 12px !important;
      width: 42px !important;
    }
  }

  .box {
    position: absolute;
    opacity: 0.77;
    width: 40%;
    bottom: 2%;
    right: 2%;
  }
}
</style>
