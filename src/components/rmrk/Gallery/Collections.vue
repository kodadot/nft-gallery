<template>
  <div class="collections container">
    <Loader :value="isLoading" />
    <!-- TODO: Make it work with graphql -->
    <b-field class="column">
      <Pagination simple :total="total" v-model="currentValue" :perPage="perPage" replace class="is-right" />
    </b-field>

    <div>
      <div class="columns is-multiline">
        <div class="column is-4" v-for="collection in results" :key="collection.id">
          <div class="card collection-card">
            <router-link
              :to="{ name: 'collectionDetail', params: { id: collection.id } }"
              tag="div"
              class="collection-card__skeleton"
            >
              <div class="card-image">
                <BasicImage :src="collection.image" :alt="collection.name" customClass="collection__image-wrapper" />
              </div>

              <div class="card-content">
                <router-link
                  :to="{
                    name: 'collectionDetail',
                    params: { id: collection.id }
                  }"
                >
                  <CollectionDetail :nfts="collection.nfts.nodes" :name="collection.name" />
                </router-link>
                <b-skeleton :active="isLoading"> </b-skeleton>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      class="pt-5 pb-5"
      :total="total"
      :perPage="perPage"
      v-model="currentValue"
      replace
    />
  </div>
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator'

import { CollectionWithMeta, Collection, Metadata } from '../service/scheme'
import { fetchCollectionMetadata, sanitizeIpfsUrl } from '../utils'
import Freezeframe from 'freezeframe'
import 'lazysizes'

import collectionListWithSearch from '@/queries/collectionListWithSearch.graphql'
import { getMany, update } from 'idb-keyval'

interface Image extends HTMLImageElement {
  ffInitialized: boolean;
}

type CollectionType = CollectionWithMeta;
const components = {
  GalleryCardList: () => import('./GalleryCardList.vue'),
  Search: () => import('./Search/SearchBar.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Pagination: () => import('./Pagination.vue'),
  CollectionDetail: () => import('@/components/rmrk/Gallery/CollectionDetail.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
}

@Component<Collections>({
  metaInfo() {
    return {
      title: 'KodaDot - Kusama Explorer all collections',
      meta: [
        {
          property: 'og:title',
          content: 'Low minting fees and carbonless NFTs'
        },
        {
          property: 'og:image',
          content: 'https://nft.kodadot.xyz/kodadot_gallery.jpg'
        },
        {
          property: 'og:description',
          content: 'Buy Carbonless NFTs on Kusama'
        },
        {
          property: 'twitter:title',
          content: 'Low minting fees and carbonless NFTs'
        },
        {
          property: 'twitter:description',
          content: 'Buy Carbonless NFTs on Kusama'
        },
        {
          property: 'twitter:image',
          content: 'https://nft.kodadot.xyz/kodadot_gallery.jpg'
        }
      ]
    }
  },
  components
})
export default class Collections extends Vue {
  private collections: Collection[] = [];
  private meta: Metadata[] = [];
  private first = 9;
  private perPage = 9;
  private placeholder = '/koda300x300.svg';
  private currentValue = 1;
  private total = 0;

  get isLoading() {
    return this.$apollo.queries.collection.loading
  }

  get offset() {
    return this.currentValue * this.first - this.first
  }

  public async created() {
    this.$apollo.addSmartQuery('collection', {
      query: collectionListWithSearch,
      manual: true,
      loadingKey: 'isLoading',
      result: this.handleResult,
      variables: () => {
        return {
          first: this.first,
          offset: this.offset,
        }
      },
      update: ({ collectionEntity }) => ({
        ...collectionEntity,
        nfts: collectionEntity.nfts.nodes
      }),
    })
  }

  protected async handleResult({ data }: any) {
    this.total = data.collectionEntities.totalCount
    this.collections = data.collectionEntities.nodes.map((e: any) => ({
      ...e,
    }))

    const storedMetadata = await getMany(
      this.collections.map(({ metadata }: any) => metadata)
    )

    storedMetadata.forEach(async (m, i) => {
      if (!m) {
        try {
          const meta = await fetchCollectionMetadata(this.collections[i])
          Vue.set(this.collections, i, {
            ...this.collections[i],
            ...meta,
            image: sanitizeIpfsUrl(meta.image || '')
          })
          update(this.collections[i].metadata, () => meta)
        } catch (e) {
          console.warn('[ERR] unable to get metadata')
        }
      } else {
        Vue.set(this.collections, i, {
          ...this.collections[i],
          ...m,
          image: sanitizeIpfsUrl(m.image || '')
        })
      }
    })


    this.prefetchPage(this.offset + this.first, this.offset + (3 * this.first))
  }


  public async prefetchPage(offset: number, prefetchLimit: number) {
    try {
      const collections = this.$apollo.query({
        query: collectionListWithSearch,
        variables: {
          first: this.first,
          offset,
        },
      })

      const {
        data: {
          collectionEntities: { nodes: collectionList }
        }
      } = await collections

      const storedPromise = getMany(collectionList.map(({ metadata }: any) => metadata))

      const storedMetadata = await storedPromise

      storedMetadata.forEach(async (m, i) => {
        if (!m) {
          try {
            const meta = await fetchCollectionMetadata(collectionList[i])
            update(collectionList[i].metadata, () => meta)
          } catch (e) {
            console.warn('[ERR] unable to get metadata')
          }
        }
      })
    } catch (e: any) {
      console.warn('[PREFETCH] Unable fo fetch', offset, e.message)
    } finally {
      if (offset <= prefetchLimit) {
        this.prefetchPage(offset + this.first, prefetchLimit)
      }
    }

  }

  get results() {
    return this.collections as CollectionWithMeta[]
  }

  setFreezeframe() {
    document.addEventListener('lazybeforeunveil', async e => {
      const target = e.target as Image
      const type = target.dataset.type as string
      const isGif = type === 'image/gif'

      if (isGif && !target.ffInitialized) {
        new Freezeframe(target, {
          trigger: false,
          overlay: true,
          warnings: false
        })

        target.ffInitialized = true
      }
    })
  }

  onError(e: Event) {
    const target = e.target as Image
    target.src = this.placeholder
  }
}
</script>

<style lang="scss">
.card-image__burned {
  filter: blur(7px);
}

.collections {
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

  .card-image img {
    border-radius: 8px;
    top: 50%;
    transition: all 0.3s;
    display: block;
    width: 100%;
    height: auto;
    transform: scale(1);
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
    color: #fff;
  }

  .card-image__emotes__count {
    vertical-align: text-bottom;
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

  .collection-collection-counter {
    top: 5px;
    right: -5px;
  }

  .columns {
    padding-top: 10px;

    .card {
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      box-shadow: 0px 0px 10px 0.5px #d32e79;

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
          background: #000;
          padding-left: 1rem;
          padding-right: 1rem;

          .heading--inline {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #fff;
          }

          .level-item {
            padding: 0.1rem;
            text-align: left;
            line-height: initial;
          }

          .collection-title {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #fff;
            font-size: 1.5rem;
          }

        }

        &:hover .collection__image-wrapper img {
          transform: scale(1.1);
          transition: transform 0.3s linear;
        }

        &:hover .ff-canvas {
          transform: scale(1.1);
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
