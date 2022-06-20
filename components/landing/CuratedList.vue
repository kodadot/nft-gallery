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
      indicator-style="is-lines">
      <b-carousel-item v-for="(collection, i) in collections" :key="i">
        <b-image
          ratio="1by1"
          class="image"
          :src="collection.image"
          :alt="collection.name"></b-image>
        <div class="box">
          <div class="content has-text-left">
            <nuxt-link
              :to="{
                name: `${urlPrefix}-collection-id`,
                params: { id: collection.id },
              }">
              <h2 class="title is-5">{{ collection.name }}</h2>
            </nuxt-link>
            <nuxt-link
              :to="{
                name: `${urlPrefix}-u-id`,
                params: { id: collection.issuer },
              }">
              <div class="is-size-7 icon-text">
                <b-icon icon="palette" />
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
import { Component, mixins, Vue } from 'nuxt-property-decorator'
import AuthMixin from '@/utils/mixins/authMixin'
import {
  getCloudflareImageLinks,
  processMetadata,
} from '~/utils/cachingStrategy'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import Unknown from '../rmrk/Media/JsonMedia.vue'
import resolveQueryPath from '~/utils/queryPathResolver'
import { mapOnlyMetadata } from '~/utils/mappers'
import { CollectionMetadata } from '../rmrk/types'
import { fastExtract } from '~/utils/ipfs'
import { getSanitizer } from '../rmrk/utils'
import { Collection } from '~/components/unique/types'

const components = {
  // Identicon: () => import('@polkadot/vue-identicon'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
}

const curatedCollection = [
  '800f8a914281765a7d-KITTY', // Kitty
  '2075be44ea4b9e422d-🐺', // WolfAngryClub
  '160a6f4320f11acb25-LCKWV', // PixelBabe
  '7472058104f9f93924-KSMRAI', // Kusamurais (substraknights)
  '7cf9daa38281a57331-BSS', // Spaceships (ClownWorldHouse)
  '900D19DC7D3C444E4C-KSMBOT', // KusamaBot (deepologics)
]

@Component<CuratedList>({
  components,
})
export default class CuratedList extends mixins(AuthMixin, PrefixMixin) {
  protected collections: Collection[] = []

  async fetch() {
    const query = await resolveQueryPath(
      this.urlPrefix,
      'collectionCuratedList'
    )
    const result = await this.$apollo
      .query<any>({
        query: query.default,
        client: this.client,
        variables:
          this.urlPrefix === 'rmrk' ? { list: curatedCollection } : Unknown,
      })
      .catch((e) => {
        this.$consola.error(e)
        return { data: null }
      })
    if (result.data) {
      await this.handleResult(result)
    }
  }

  protected async handleResult({ data }: any) {
    this.collections = data.collectionEntities.map((e: any) => ({
      ...e,
      metadata: e.meta?.id || e.metadata,
    }))
    const metadataList: string[] = this.collections.map(mapOnlyMetadata)
    const imageLinks = await getCloudflareImageLinks(metadataList)

    processMetadata<CollectionMetadata>(metadataList, (meta, i) => {
      Vue.set(this.collections, i, {
        ...this.collections[i],
        ...meta,
        image:
          imageLinks[fastExtract(this.collections[i]?.metadata)] ||
          getSanitizer(meta.image || '')(meta.image || ''),
      })
    })
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

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
