<template>
  <div class="mb-3">
    <div class="row" v-if="!isVisible && !hideSearchInput">
      <div v-if="sliderDirty && !hideFilter" class="is-size-7">
        Prices ranging from {{ this.query.priceMin / 1000000000000 }} to
        {{ this.query.priceMax / 1000000000000 }}
      </div>
    </div>
    <div class="columns mb-0">
      <b-field class="column is-6 mb-0" :class="searchColumnClass">
        <b-button
          v-if="!hideFilter"
          icon-left="filter"
          aria-controls="sortAndFilter"
          type="is-primary is-bordered-light"
          class="is-hidden-mobile mr-2"
          @click="isVisible = !isVisible" />
        <slot name="next-filter"></slot>
        <b-autocomplete
          v-if="!hideSearchInput"
          class="gallery-search"
          v-model="name"
          :data="searchSuggestion"
          group-field="type"
          group-options="item"
          placeholder="Search..."
          icon="search"
          open-on-focus
          clearable
          max-height="550px"
          dropdown-position="is-bottom-left"
          expanded
          @typing="updateSuggestion"
          @keydown.native.enter="nativeSearch"
          @focus="fetchSuggestionsOnce"
          @select="updateSelected">
          <template slot-scope="props">
            <div v-if="props.option.type === 'Search'">
              <div class="media">
                <div class="media-left">
                  <b-icon icon="search" size="is-medium" />
                </div>
                <div class="media-content">{{ props.option.name }}</div>
              </div>
            </div>

            <div v-else-if="props.option.type === 'History'">
              <div class="media">
                <div class="media-left">
                  <b-icon icon="history" size="is-medium" />
                </div>
                <div class="media-content">{{ props.option.name }}</div>
                <div
                  class="media-right"
                  @click.stop.prevent="removeSearchHistory(props.option.name)">
                  <b-button type="is-text" icon-left="times" />
                </div>
              </div>
            </div>

            <div v-else>
              <div class="media">
                <div class="media-left">
                  <BasicImage
                    customClass="is-32x32"
                    :src="props.option.image || '/placeholder.webp'" />
                  <!-- <div class="preview-media-wrapper">
                  <PreviewMediaResolver
                    v-if="!props.option.image && props.option.animation_url"
                    :src="props.option.animation_url"
                    :metadata="props.option.metadata"
                    :mimeType="props.option.type"
                  />
                  </div> -->
                </div>
                <div class="media-content">
                  {{ props.option.name }}
                </div>
              </div>
            </div>
          </template>
          <template #footer>
            <a
              v-if="autocompleteFooterShow"
              @click.stop.prevent="searchSuggestionEachTypeMaxNum = bigNum"
              class="navbar-item"
              style="justify-content: center; margin-right: 0.8em">
              All results
            </a>
          </template>
        </b-autocomplete>
        <div v-if="!isVisible && hideSearchInput">
          <div v-if="sliderDirty" class="is-size-7">
            Prices ranging from {{ this.query.priceMin / 1000000000000 }} to
            {{ this.query.priceMax / 1000000000000 }}
          </div>
        </div>
      </b-field>
      <b-field
        expanded
        position="is-right"
        class="column is-6"
        v-if="!hideFilter">
        <b-button
          icon-left="filter"
          aria-controls="sortAndFilter"
          type="is-primary"
          class="is-hidden-tablet mr-2"
          @click="isVisible = !isVisible" />
        <slot />
      </b-field>
    </div>
    <b-collapse
      aria-id="sortAndFilter"
      animation="opacitySlide"
      v-model="isVisible">
      <div class="columns mb-0">
        <Sort class="column is-4 mb-0" :value="sortBy" @input="updateSortBy" />
        <BasicSwitch
          class="is-flex column is-4"
          v-model="vListed"
          :label="!replaceBuyNowWithYolo ? 'sort.listed' : 'YOLO'"
          size="is-medium"
          labelColor="is-success" />
      </div>
      <b-slider
        v-if="listed"
        class="column is-half"
        v-model="rangeSlider"
        :custom-formatter="(val) => `${val} KSM`"
        :max="30"
        :min="0"
        :step="1"
        ticks
        @change="sliderChange">
      </b-slider>
      <div v-if="sliderDirty" class="is-size-7">
        Prices ranging from {{ this.query.priceMin / 1000000000000 }} to
        {{ this.query.priceMax / 1000000000000 }}
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { exist } from './exist'
import nftListWithSearch from '@/queries/nftListWithSearch.graphql'
import seriesInsightList from '@/queries/rmrk/subsquid/seriesInsightList.graphql'
import collectionListWithSearch from '@/queries/collectionListWithSearch.graphql'
import lastNftListByEvent from '@/queries/rmrk/subsquid/lastNftListByEvent.graphql'
import { SearchQuery, SearchSuggestion } from './types'
import { denyList } from '@/utils/constants'
import { NFT, NFTWithMeta, CollectionWithMeta } from '../../service/scheme'
import { getSanitizer } from '../../utils'
import shouldUpdate from '~/utils/shouldUpdate'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import { mapNFTorCollectionMetadata } from '~/utils/mappers'
import {
  getCloudflareImageLinks,
  processMetadata,
} from '~/utils/cachingStrategy'
import { fastExtract } from '~/utils/ipfs'

const SearchPageRoutePathList = ['/collections', '/gallery', '/explore']

@Component({
  components: {
    Sort: () => import('./SearchSortDropdown.vue'),
    TypeTagInput: () => import('./TypeTagInput.vue'),
    Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
    BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
    // PreviewMediaResolver: () => import('@/components/rmrk/Media/PreviewMediaResolver.vue'), // TODO: need to fix CSS for model-viewer
  },
})
export default class SearchBar extends mixins(
  PrefixMixin,
  KeyboardEventsMixin
) {
  @Prop(String) public search!: string
  @Prop(String) public type!: string
  @Prop(String) public sortBy!: string
  @Prop(String) public searchColumnClass!: string
  @Prop(Boolean) public listed!: boolean
  @Prop(Boolean) public hideFilter!: boolean
  @Prop(Boolean) public hideSearchInput!: boolean
  @Prop(Boolean) public showDefaultSuggestions!: boolean

  protected isVisible = false
  private query: SearchQuery = {
    search: '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: true,
  }

  private first = 30
  private currentValue = 1
  private nftResult: NFTWithMeta[] = []
  private collectionResult: CollectionWithMeta[] = []
  private searchString = ''
  private name = ''
  private searched: NFT[] = []
  private rangeSlider = [0, 5]
  private sliderDirty = false
  private searchSuggestionEachTypeMaxNum = 3
  private bigNum = 1e10
  private keyDownNativeEnterFlag = true
  private defaultNFTSuggestions: NFTWithMeta[] = []
  private defaultCollectionSuggestions: CollectionWithMeta[] = []

  public async fetchSuggestionsOnce() {
    if (
      this.showDefaultSuggestions &&
      this.urlPrefix === 'rmrk' &&
      this.defaultCollectionSuggestions.length === 0
    ) {
      try {
        const { data } = await this.$apollo.query<{
          events: [{ meta; timestamp; nft }]
        }>({
          query: lastNftListByEvent,
          client: 'subsquid',
          variables: {
            limit: this.searchSuggestionEachTypeMaxNum,
            event: 'LIST',
            and: {
              meta_not_eq: '0',
            },
          },
        })

        const nfts = [...data.events].map((event) => event.nft)
        const nFTMetadataList: string[] = nfts.map(mapNFTorCollectionMetadata)
        getCloudflareImageLinks(nFTMetadataList).then((imageLinks) => {
          const nftResult: NFTWithMeta[] = []
          processMetadata<NFTWithMeta>(nFTMetadataList, (meta, i) => {
            nftResult.push({
              ...nfts[i],
              ...meta,
              image:
                (nfts[i]?.metadata &&
                  imageLinks[fastExtract(nfts[i].metadata)]) ||
                getSanitizer(meta.image || '')(meta.image || ''),
              animation_url: getSanitizer(meta.animation_url || '')(
                meta.animation_url || ''
              ),
            })
          }).then(() => {
            this.defaultNFTSuggestions = nftResult
          })
        })

        const result = await this.$apollo.query({
          query: seriesInsightList,
          client: this.client,
          variables: {
            limit: this.searchSuggestionEachTypeMaxNum,
            orderBy: 'volume_DESC',
          },
        })

        const {
          data: { collectionEntities: collections },
        } = result

        const collectionMetadataList = collections.map(
          mapNFTorCollectionMetadata
        )
        getCloudflareImageLinks(collectionMetadataList).then((imageLinks) => {
          const collectionResult: CollectionWithMeta[] = []
          processMetadata<CollectionWithMeta>(
            collectionMetadataList,
            (meta, i) => {
              collectionResult.push({
                ...collections[i],
                ...meta,
                image:
                  (collections[i]?.metadata &&
                    imageLinks[fastExtract(collections[i].metadata)]) ||
                  getSanitizer(meta.image || '')(meta.image || ''),
              })
            }
          ).then(() => {
            this.defaultCollectionSuggestions = collectionResult
          })
        })
      } catch (e) {
        this.$consola.warn(e, 'Error while fetching default suggestions')
      }
    }
  }

  public mounted(): void {
    this.getSearchHistory()
    exist(this.$route.query.search, this.updateSearch)
    exist(this.$route.query.min, this.updatePriceMin)
    exist(this.$route.query.max, this.updatePriceMax)
    exist(this.$route.query.type, this.updateType)
    exist(this.$route.query.sort, this.updateSortBy)
    exist(this.$route.query.listed, this.updateListed)
  }

  public created() {
    this.initKeyboardEventHandler({
      f: this.bindFilterEvents,
    })
  }

  private bindFilterEvents(event) {
    switch (event.key) {
      case 'b':
        this.updateListed(!this.vListed)
        break
      case 'n':
        this.updateSortBy('BLOCK_NUMBER_DESC')
        break
      case 'o':
        this.updateSortBy('BLOCK_NUMBER_ASC')
        break
      case 'e':
        this.updateSortBy('PRICE_DESC')
        break
      case 'c':
        this.updateSortBy('PRICE_ASC')
        break
    }
  }

  get vListed(): boolean {
    this.query.listed = this.listed
    return this.listed
  }

  set vListed(listed: boolean) {
    this.updateListed(listed)
  }

  get searchQuery(): string {
    return this.search
  }

  set searchQuery(value: string) {
    this.updateSearch(value)
  }

  get offset() {
    return this.currentValue * this.first - this.first
  }

  get autocompleteFooterShow() {
    const searchResultExist =
      this.nftResult.length > 0 || this.collectionResult.length > 0
    if (
      searchResultExist &&
      this.searchSuggestionEachTypeMaxNum !== this.bigNum
    ) {
      return true
    }
    return false
  }

  get searchSuggestion() {
    if (this.urlPrefix !== 'rmrk') {
      return []
    }
    const suggestions: SearchSuggestion[] = []
    const eachTypeMaxNum = this.searchSuggestionEachTypeMaxNum

    // whether show Search
    // const currentSearchNameInHistorySearch = this.oldSearchResult(this.name)
    // if (!currentSearchNameInHistorySearch && this.name) {
    //   suggestions.push({
    //     type: 'Search',
    //     item: [{ type: 'Search', name: this.name }],
    //   })
    // }

    // show default suggestions when no search has been done yet (e.g. on focus)
    if (!this.searchString) {
      if (this.defaultNFTSuggestions.length > 0) {
        suggestions.push({
          type: 'Newest Listings',
          item: this.defaultNFTSuggestions,
        })
      }
      if (this.defaultCollectionSuggestions.length > 0) {
        suggestions.push({
          type: 'Popular Collections',
          item: this.defaultCollectionSuggestions,
        })
      }
    }

    // whether show History
    if (this.filterSearch.length > 0) {
      suggestions.push({
        type: 'History',
        item:
          this.filterSearch.length > eachTypeMaxNum
            ? this.filterSearch.slice(0, eachTypeMaxNum)
            : this.filterSearch,
      })
    }

    // whether show Collection Item
    if (this.collectionResult.length > 0) {
      suggestions.push({
        type: 'Collections',
        item:
          this.collectionResult.length > eachTypeMaxNum
            ? this.collectionResult.slice(0, eachTypeMaxNum)
            : this.collectionResult,
      })
    }

    // whether show NFT Item
    if (this.nftResult.length > 0) {
      suggestions.push({
        type: 'Items',
        item:
          this.nftResult.length > eachTypeMaxNum
            ? this.nftResult.slice(0, eachTypeMaxNum)
            : this.nftResult,
      })
    }

    return suggestions
  }

  get replaceBuyNowWithYolo(): boolean {
    return this.$store.getters['preferences/getReplaceBuyNowWithYolo']
  }

  @Emit('update:listed')
  @Debounce(50)
  updateListed(value: string | boolean): boolean {
    const v = String(value)
    this.replaceUrl(v, undefined, 'listed')
    return v === 'true'
  }

  insertNewHistory() {
    for (const s of this.searched) {
      if (s.name === this.searchString) {
        return
      }
    }
    const newResult = {
      type: 'History',
      name: this.searchString,
    } as unknown as NFT
    this.searched.push(newResult)
    localStorage.kodaDotSearchResult = JSON.stringify(this.searched)
  }

  @Emit('update:type')
  @Debounce(50)
  updateType(value: string): string {
    this.replaceUrl(value, undefined, 'type')
    return value
  }

  @Emit('update:sortBy')
  @Debounce(400)
  updateSortBy(value: string): string {
    this.replaceUrl(value, undefined, 'sort')
    return value
  }

  // not highlight search, just input keyword and enter
  nativeSearch() {
    this.keyDownNativeEnterFlag = true
    setTimeout(() => {
      if (this.keyDownNativeEnterFlag) {
        this.updateSelected({
          type: 'Search',
          name: this.searchString,
        })
      }
    }, 100) // it means no highlight and not highlight select
  }

  @Debounce(50)
  updateSelected(value: any) {
    //To handle clearing event
    this.keyDownNativeEnterFlag = false
    if (!value) {
      return
    }
    if (value.type == 'History') {
      this.updateSearch(value.name)
    } else if (value.type == 'Search') {
      this.insertNewHistory()
      this.updateSearch(value.name)
    } else if (value.__typename === 'NFTEntity') {
      this.$router.push({ name: 'rmrk-detail-id', params: { id: value.id } })
    } else if (
      value.__typename === 'CollectionEntity' ||
      value.__typename === 'Series'
    ) {
      this.$router.push({
        name: 'rmrk-collection-id',
        params: { id: value.id },
      })
    }
  }

  redirectToGalleryPageIfNeed() {
    if (SearchPageRoutePathList.indexOf(this.$route.path) === -1) {
      this.$router.replace({
        name: 'rmrk-explore',
        query: this.$route.query,
      })
    }
  }

  @Emit('update:search')
  @Debounce(50)
  updateSearch(value: string): string {
    shouldUpdate(value, this.searchQuery) && this.replaceUrl(value)
    this.redirectToGalleryPageIfNeed()
    return value
  }

  updatePriceMin(value: string) {
    const min = Number(value)
    if (!Number.isNaN(min)) {
      if (!this.sliderDirty) {
        this.sliderDirty = true
      }
      this.rangeSlider = [min, this.rangeSlider[1]]
      this.sliderChangeMin(min * 1000000000000)
    }
  }

  updatePriceMax(value: string) {
    const max = Number(value)
    if (!Number.isNaN(max)) {
      if (!this.sliderDirty) {
        this.sliderDirty = true
      }
      this.rangeSlider = [this.rangeSlider[0], max]
      this.sliderChangeMax(max * 1000000000000)
    }
  }

  // when user type some keyword, frontEnd will query related information
  @Debounce(50)
  updateSuggestion(value: string) {
    this.searchString = value
    //To handle empty string
    if (!value) {
      // reset query-based search results once searchString is empty
      this.collectionResult = []
      this.nftResult = []
      return
    }

    this.query.search = value
    this.searchSuggestionEachTypeMaxNum = 3

    this.$apollo
      .query({
        query: nftListWithSearch,
        client: this.urlPrefix,
        variables: {
          first: this.first,
          offset: this.offset,
          denyList,
          orderBy: this.query.sortBy,
          search: this.buildSearchParam(),
        },
      })
      .then((result) => {
        const {
          data: {
            nFTEntities: { nodes: nfts },
          },
        } = result
        const metadataList: string[] = nfts.map(mapNFTorCollectionMetadata)
        getCloudflareImageLinks(metadataList).then((imageLinks) => {
          const nftResult: NFTWithMeta[] = []
          processMetadata<NFTWithMeta>(metadataList, (meta, i) => {
            nftResult.push({
              ...nfts[i],
              ...meta,
              image:
                (nfts[i]?.metadata &&
                  imageLinks[fastExtract(nfts[i].metadata)]) ||
                getSanitizer(meta.image || '')(meta.image || ''),
              animation_url: getSanitizer(meta.animation_url || '')(
                meta.animation_url || ''
              ),
            })
          }).then(() => {
            this.nftResult = nftResult
          })
        })
      })
      .catch((e) => {
        this.$consola.warn(
          '[PREFETCH] Unable fo fetch nft items',
          this.offset,
          e.message
        )
      })

    this.$apollo
      .query({
        query: collectionListWithSearch,
        client: this.urlPrefix,
        variables: {
          first: this.first,
          offset: this.offset,
          denyList,
          orderBy: this.query.sortBy,
          search: this.buildSearchParam(),
        },
      })
      .then((result) => {
        const {
          data: {
            collectionEntities: { nodes: collections },
          },
        } = result
        const metadataList: string[] = collections.map(
          mapNFTorCollectionMetadata
        )
        getCloudflareImageLinks(metadataList).then((imageLinks) => {
          const collectionResult: CollectionWithMeta[] = []
          processMetadata<CollectionWithMeta>(metadataList, (meta, i) => {
            collectionResult.push({
              ...collections[i],
              ...meta,
              image:
                (collections[i]?.metadata &&
                  imageLinks[fastExtract(collections[i].metadata)]) ||
                getSanitizer(meta.image || '')(meta.image || ''),
            })
          }).then(() => {
            this.collectionResult = collectionResult
          })
        })
      })
      .catch((e) => {
        this.$consola.warn(
          '[PREFETCH] Unable fo fetch collection items',
          this.offset,
          e.message
        )
      })
  }

  @Debounce(100)
  replaceUrl(value: string, value2?, key = 'search', key2?): void {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: {
          page: '1',
          ...this.$route.query,
          search: this.searchQuery,
          [key]: value,
          [key2]: value2,
        },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
    // if searchbar request or filter is set, pagination should always revert to page 1
    this.$emit('resetPage')
  }
  private buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []

    if (this.query.search) {
      params.push({
        name: { likeInsensitive: `%${this.query.search}%` },
      })
    }

    if (this.query.listed) {
      params.push({
        price: { greaterThan: '0' },
      })
    }

    return params
  }
  private getSearchHistory() {
    // localStorage.kodaDotSearchResult = ''
    const cacheResult = localStorage.kodaDotSearchResult
    if (cacheResult) {
      this.searched = JSON.parse(cacheResult)
    }
  }

  private get filterSearch(): NFT[] {
    // filter the history search which is not similar to searchString
    if (!this.searched.length) {
      return []
    }
    return this.searched.filter((option) => {
      return (
        option.name
          .toString()
          .toLowerCase()
          .indexOf((this.searchString || '').toLowerCase()) >= 0
      )
    })
  }

  private oldSearchResult(value: string): boolean {
    // whether this search exactly match the old search
    const res = this.searched.filter((r) => r.name === value)
    return !!res.length
  }

  private removeSearchHistory(value: string): void {
    this.searched = this.searched.filter((r) => r.name !== value)
    localStorage.kodaDotSearchResult = JSON.stringify(this.searched)
  }

  @Debounce(50)
  private sliderChange([min, max]: [number, number]): void {
    if (!this.sliderDirty) {
      this.sliderDirty = true
    }
    this.sliderChangeMin(min * 1000000000000)
    this.sliderChangeMax(max * 1000000000000)
    const priceMin = String(min)
    const priceMax = String(max)
    this.replaceUrl(priceMin, priceMax, 'min', 'max')
  }

  @Emit('update:priceMin')
  @Debounce(50)
  private sliderChangeMin(min: number): void {
    this.query.priceMin = min
  }

  @Emit('update:priceMax')
  @Debounce(50)
  private sliderChangeMax(max: number): void {
    this.query.priceMax = max
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';

.b-skeleton {
  height: 32px !important;
  width: 32px !important;
  position: absolute;
  top: 0;
  left: 0;
}

.media {
  align-items: center;
}
.is-32x32 {
  font-size: 0;
}
.is-text {
  &:hover,
  &:focus {
    background-color: $primary !important;
    transition: all 3s !important;
  }
}
</style>
