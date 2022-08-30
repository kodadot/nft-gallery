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
            <nuxt-link
              :to="{
                name: `${urlPrefix}-collection-id`,
                params: { id: collection.id },
              }">
              <h2 class="title is-5" data-cy="curated-name">
                {{ collection.name }}
              </h2>
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
import {
  getCloudflareImageLinks,
  processMetadata,
} from '@/utils/cachingStrategy'
import { fastExtract } from '@/utils/ipfs'
import { mapOnlyMetadata } from '@/utils/mappers'

import { SomethingWithMeta, getSanitizer } from '@/components/rmrk/utils'
import { CollectionMetadata } from '@/components/rmrk/types'
import { Collection } from '@/components/unique/types'

import Identity from '@/components/identity/IdentityIndex.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'

const curatedCollection = [
  '800f8a914281765a7d-KITTY', // Kitty
  '2075be44ea4b9e422d-🐺', // WolfAngryClub
  '160a6f4320f11acb25-LCKWV', // PixelBabe
  '0a24c7876a892acb79-RADTOADZ', // RadToadz (ZestLifeLab)
  '7cf9daa38281a57331-BSS', // Spaceships (ClownWorldHouse)
  '900D19DC7D3C444E4C-KSMBOT', // KusamaBot (deepologics)
]

const { urlPrefix } = usePrefix()
const { data } = useGraphql({
  queryname: 'collectionCuratedList',
  queryPath: urlPrefix.value,
  variables:
    urlPrefix.value === 'rmrk' ? { list: curatedCollection } : undefined,
})

type Collections = Collection & SomethingWithMeta
const collections = ref<Collections[]>([])

const updateCollections = async ({ data }) => {
  if (!data?.collectionEntities.length) {
    return
  }

  collections.value = data.collectionEntities.map((e) => ({
    ...e,
    metadata: e.meta?.id || e.metadata,
    image: '',
  })) as Collections[]
  const metadataList: string[] = collections.value.map(mapOnlyMetadata)
  const imageLinks = await getCloudflareImageLinks(metadataList)

  processMetadata<CollectionMetadata>(metadataList, (meta, i) => {
    collections.value[i].image =
      imageLinks[fastExtract(collections.value[i]?.metadata)] ||
      getSanitizer(meta.image || '')(meta.image || '')
  })
}

watch(data, () => {
  updateCollections({ data: data.value })
})
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
