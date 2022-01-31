<template>
  <div class="collections">
    <Loader :value="isLoading" />
    <Search v-bind.sync="searchQuery">
      <b-field>
        <Pagination
          hasMagicBtn
          simple
          replace
          preserveScroll
          :total="total"
          v-model="currentValue"
          :per-page="first" />
      </b-field>
    </Search>

    <div>
      <div class="columns is-multiline">
        <div
          class="column is-4"
          v-for="collection in results"
          :key="collection.id">
          <div class="card collection-card">
            <nuxt-link
              :to="`/rmrk/collection/${collection.id}`"
              tag="div"
              class="collection-card__skeleton">
              <div class="card-image">
                <BasicImage
                  :src="collection.image"
                  :alt="collection.name"
                  customClass="collection__image-wrapper" />
              </div>

              <div class="card-content">
                <nuxt-link :to="`/rmrk/collection/${collection.id}`">
                  <CollectionDetail
                    :nfts="collection.nfts.nodes"
                    :name="collection.name" />
                </nuxt-link>
                <b-skeleton :active="isLoading"> </b-skeleton>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      class="pt-5 pb-5"
      :total="total"
      :perPage="first"
      v-model="currentValue"
      replace />
  </div>
</template>

<script lang="ts">
import { Component, mixins, Vue } from 'nuxt-property-decorator'

import {
  CollectionWithMeta,
  Collection,
  Metadata,
} from '@/components/rmrk/service/scheme'
import {
  fetchCollectionMetadata,
  sanitizeIpfsUrl,
} from '@/components/rmrk/utils'
import { SearchQuery } from '@/components/rmrk/Gallery/Search/types'
import 'lazysizes'

import collectionListWithSearch from '@/queries/collectionListWithSearch.graphql'
import { getMany, update } from 'idb-keyval'
import PrefixMixin from '~/utils/mixins/prefixMixin'

interface Image extends HTMLImageElement {
  ffInitialized: boolean
}

type CollectionType = CollectionWithMeta
const components = {
  GalleryCardList: () =>
    import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Search: () =>
    import('@/components/rmrk/Gallery/Search/SearchBarCollection.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  CollectionDetail: () =>
    import('@/components/rmrk/Gallery/CollectionDetail.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
}

@Component<Collections>({
  components,
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: '/rmrk/collections',
      image: `${this.$config.baseUrl}/k_card_collections.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class Collections extends mixins(PrefixMixin) {
  private collections: Collection[] = []
  private meta: Metadata[] = []
  public first = this.$store.state.preferences.collectionsPerPage
  private placeholder = '/placeholder.webp'
  private currentValue = 1
  private total = 0
  private searchQuery: SearchQuery = {
    search: '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: false,
  }

  get isLoading(): boolean {
    return this.$apollo.queries.collection.loading
  }

  get offset(): number {
    return this.currentValue * this.first - this.first
  }

  private buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []

    if (this.searchQuery.search) {
      params.push({
        name: { likeInsensitive: `%${this.searchQuery.search}%` },
      })
    }

    return params
  }

  public async created() {
    this.$apollo.addSmartQuery('collection', {
      query: collectionListWithSearch,
      manual: true,
      client: this.urlPrefix,
      loadingKey: 'isLoading',
      result: this.handleResult,
      variables: () => {
        return {
          orderBy: this.searchQuery.sortBy,
          search: this.buildSearchParam(),
          listed: this.searchQuery.listed
            ? [{ price: { greaterThan: '0' } }]
            : [],
          first: this.first,
          offset: this.offset,
        }
      },
      update: ({ collectionEntity }) => ({
        ...collectionEntity,
        nfts: collectionEntity.nfts.nodes,
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
            image: sanitizeIpfsUrl(meta.image || ''),
          })
          update(this.collections[i].metadata, () => meta)
        } catch (e) {
          console.warn('[ERR] unable to get metadata')
        }
      } else {
        Vue.set(this.collections, i, {
          ...this.collections[i],
          ...m,
          image: sanitizeIpfsUrl(m.image || ''),
        })
      }
    })

    this.prefetchPage(this.offset + this.first, this.offset + 3 * this.first)
  }

  public async prefetchPage(offset: number, prefetchLimit: number) {
    try {
      const collections = this.$apollo.query({
        query: collectionListWithSearch,
        client: this.urlPrefix,
        variables: {
          first: this.first,
          offset,
        },
      })

      const {
        data: {
          collectionEntities: { nodes: collectionList },
        },
      } = await collections

      const storedPromise = getMany(
        collectionList.map(({ metadata }: any) => metadata)
      )

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

  onError(e: Event) {
    const target = e.target as Image
    target.src = this.placeholder
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';
.card-image__burned {
  filter: blur(7px);
}

.collections {
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
      border: 2px solid $primary-light;

      &-image {
        &__emotes {
          position: absolute;
          background-color: $primary-light;
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
          background-color: $grey-darker;
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

      .card-content {
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
        .collection-title-class {
          max-width: 100%;
          text-align: center;
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
        }

        &:hover .collection__image-wrapper img {
          transform: scale(1.1);
          transition: transform 0.3s linear;
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
