<template>
  <div class="section">
    <div class="pack-item-wrapper container">
      <div class="columns is-centered">
        <div class="column is-half has-text-centered">
          <div class="container image is-128x128 mb-2">
            <b-image
              v-if="!isLoading"
              :src="image"
              :alt="name"
              ratio="1by1"
              rounded
            ></b-image>
          </div>
          <h1 class="title is-2">
            {{ name }}
          </h1>
        </div>
      </div>

      <div class="columns is-align-items-center">
        <div class="column">
          <div class="label">
            {{ $t('creator') }}
          </div>
          <div class="subtitle is-size-6">
            <ProfileLink :address="issuer" :inline="true" :showTwitter="true"/>
          </div>
        </div>
        <div class="column" v-if="owner">
          <div class="label">
            {{ $t('owner') }}
          </div>
          <div class="subtitle is-size-6">
            <ProfileLink :address="owner" :inline="true" :showTwitter="true" />
          </div>
        </div>
        <div class="column is-narrow">
          <CollectionActivity :nfts="stats" />
        </div>
        <div class="column has-text-right">
          <Sharing v-if="sharingVisible"
            class="mb-2"
            :label="name"
            :iframe="iframeSettings">
              <DonationButton :address="issuer" />
          </Sharing>
        </div>
      </div>

      <div class="columns is-centered">
        <div class="column is-8 has-text-centered">
          <VueMarkdown :source="description" />
        </div>
      </div>

      <Search v-bind.sync="searchQuery">
        <b-field>
          <Pagination class="mb-0" hasMagicBtn simple replace preserveScroll :total="total" v-model="currentValue" :per-page="first" />
        </b-field>
      </Search>

      <GalleryCardList :items="collection.nfts" />

      <Pagination
        class="py-5"
        replace
        preserveScroll
        :total="total"
        v-model="currentValue"
        :per-page="first"
      />
    </div>
  </div>
</template>

<script lang="ts" >
import { emptyObject } from '@/utils/empty'
import { Component, Vue } from 'vue-property-decorator'
import { CollectionWithMeta } from '../service/scheme'
import { sanitizeIpfsUrl, fetchCollectionMetadata } from '../utils'
import isShareMode from '@/utils/isShareMode'
import collectionById from '@/queries/collectionById.graphql'
import nftListByCollection from '@/queries/nftListByCollection.graphql'
import { CollectionMetadata } from '../types'
import { NFT } from '@/components/rmrk/service/scheme'
import { SearchQuery } from './Search/types'


const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  CollectionActivity: () => import('@/components/rmrk/Gallery/CollectionActivity.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  VueMarkdown: () => import('vue-markdown-render'),
  Search: () => import('./Search/SearchBarCollection.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  DonationButton: () => import('@/components/transfer/DonationButton.vue'),
}
@Component<CollectionItem>({
  metaInfo() {
    return {
      title: 'KodaDot cares about environmental impact',
      titleTemplate: '%s | Low Carbon NFTs',
      meta: [
        { name: 'description', content: 'Creating Carbonless NFTs on Kusama' },
        { property: 'og:title', content: this.collection.name || 'KodaDot cares about environmental impact'},
        { property: 'og:url', content: 'https://nft.kodadot.xyz/' + this.$route.path },
        { property: 'og:image', content: this.meta.image || 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
        { property: 'og:description', content: this.meta.description || 'Creating Carbonless NFTs on Kusama'},
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:title', content: this.collection.name || 'KodaDOT cares about environmental impact'},
        { property: 'twitter:description', content: this.meta.description || 'Creating Carbonless NFTs on Kusama'},
        { property: 'twitter:image', content: this.meta.image || 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
      ]
    }
  },
  components })
export default class CollectionItem extends Vue {
  private id = '';
  private collection: CollectionWithMeta = emptyObject<CollectionWithMeta>();
  private isLoading = false;
  public meta: CollectionMetadata = emptyObject<CollectionMetadata>();
  private searchQuery: SearchQuery = {
    search: '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: false,
  };
  private currentValue = 1;
  private first = 15;
  private total = 0;
  protected stats: NFT[] = [];

  get offset(): number {
    return this.currentValue * this.first - this.first
  }

  get image(): string {
    return this.meta.image || ''
  }

  get description(): string {
    return this.meta.description || ''
  }

  get name(): string {
    return this.collection.name || this.id
  }

  get nfts(): NFT[] {
    return this.collection.nfts || []
  }

  get issuer(): string {
    return this.collection.issuer || ''
  }

  get owner(): string {
    return this.collection.issuer === (this.collection as any).currentOwner ? '' : (this.collection as any).currentOwner
  }

  get sharingVisible(): boolean {
    return !isShareMode
  }

  private buildSearchParam(): Record<string, unknown>[] {
    const params = []

    if (this.searchQuery.search) {
      params.push({
        name: { likeInsensitive: `%${this.searchQuery.search}%` }
      })
    }

    if (this.searchQuery.listed) {
      params.push({
        price: { greaterThan: '0' }
      })
    }

    return params
  }

  public created(): void {
    this.isLoading = true
    this.checkId()
    this.$apollo.addSmartQuery('collection', {
      query: collectionById,
      variables: () => {
        return {
          id: this.id,
          orderBy: this.searchQuery.sortBy,
          search: this.buildSearchParam(),
          first: this.first,
          offset: this.offset
        }
      },
      update: ({ collectionEntity }) => ({
        ...collectionEntity,
        nfts: collectionEntity.nfts.nodes
      }),
      result: this.handleResult,
    })

    this.loadStats()
    this.isLoading = false
  }

  public async loadStats(): Promise<void> {
    const nftStatsP = this.$apollo.query({
      query: nftListByCollection,
      variables: {
        id: this.id,
      }
    })

    nftStatsP.then(({ data }) => data?.nFTEntities?.nodes || []).then(nfts => {
      this.stats = nfts
    })
  }

  public async handleResult({data}: any): Promise<void> {
    this.total = data.collectionEntity.nfts.totalCount
    this.fetchMetadata()
  }

  public async fetchMetadata(): Promise<void> {
    console.log(this.collection['metadata'], !this.meta['image'])
    if (this.collection['metadata'] && !this.meta['image']) {
      const meta = await fetchCollectionMetadata(this.collection)
      this.meta = {
        ...meta,
        image: sanitizeIpfsUrl(meta.image || ''),
      }
    }
  }

  public checkId(): void {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    }
  }

  get iframeSettings(): Record<string, unknown> {
    return { width: '100%', height: '100vh' }
  }
}
</script>
