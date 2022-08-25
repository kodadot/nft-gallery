<template>
  <div class="mb-3">
    <div v-if="!isVisible && !hideSearchInput" class="row">
      <div v-if="sliderDirty && !hideFilter" class="is-size-7">
        <PriceRange :from="minPrice" :to="maxPrice" inline />
      </div>
    </div>
    <div class="columns mb-0">
      <b-field class="column is-8 mb-0 mr-2" :class="searchColumnClass">
        <b-button
          v-if="!hideFilter"
          icon-left="filter"
          aria-controls="sortAndFilter"
          type="is-primary is-bordered-light"
          class="is-hidden-mobile mr-2"
          data-cy="expand-search"
          @click="isVisible = !isVisible" />
        <slot name="next-filter"></slot>
        <b-autocomplete
          v-if="!hideSearchInput"
          ref="searchRef"
          v-model="name"
          class="gallery-search"
          placeholder="Search Artwork, Collection..."
          icon="search"
          :open-on-focus="showDefaultSuggestions"
          clearable
          max-height="500"
          dropdown-position="bottom"
          expanded
          @blur="onBlur"
          @typing="updateSuggestion"
          @keydown.native.down="onKeydownSelected(+1)"
          @keydown.native.up="onKeydownSelected(-1)"
          @keydown.native.enter="nativeSearch">
          <template #header>
            <b-tabs
              v-show="name"
              v-model="activeSearchTab"
              class="tabs-container-mobile"
              destroy-on-hide
              expanded>
              <b-tab-item label="Collections" value="Collections">
                <div
                  v-for="(item, idx) in collectionSuggestion"
                  :key="item.id"
                  :value="item"
                  :class="`mb-2 link-item ${
                    idx === selectedIndex ? 'selected-item' : ''
                  }`"
                  @click="gotoCollectionItem(item)">
                  <div class="media">
                    <div class="media-left">
                      <BasicImage
                        rounded
                        custom-class="is-64x64"
                        :src="item.image || '/placeholder.webp'" />
                    </div>
                    <div class="media-content">
                      <div
                        class="is-flex is-flex-direction-row is-justify-content-space-between pt-2 pr-2">
                        <span class="main-title name">{{ item.name }}</span>
                        <span>{{ urlPrefix.toUpperCase() }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <nuxt-link
                  :to="{
                    name: routeOf('explore'),
                    query: { ...$route.query, tab: 'COLLECTION' },
                  }">
                  <div>{{ $t('search.seeAll') }} --></div>
                </nuxt-link>
              </b-tab-item>
              <b-tab-item label="NFTs" value="NFTs">
                <div
                  v-for="(item, idx) in nftSuggestion"
                  :key="item.id"
                  :value="item"
                  :class="`mb-2 link-item ${
                    idx === selectedIndex ? 'selected-item' : ''
                  }`"
                  @click="gotoGalleryItem(item)">
                  <div class="media">
                    <div class="media-left">
                      <BasicImage
                        rounded
                        custom-class="is-64x64"
                        :src="item.image || '/placeholder.webp'" />
                    </div>
                    <div class="media-content">
                      <div
                        class="is-flex is-flex-direction-row is-justify-content-space-between pt-2 pr-2">
                        <span class="main-title name">{{ item.name }}</span>
                        <span>{{ urlPrefix.toUpperCase() }}</span>
                      </div>
                      <div
                        class="is-flex is-flex-direction-row is-justify-content-space-between pt-1 pr-2">
                        <span class="name">{{ item.collection?.name }}</span>
                        <span v-if="item.price && parseFloat(item.price) > 0">
                          Price:
                          <Money :value="item.price" inline />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <nuxt-link
                  :to="{
                    name: routeOf('explore'),
                    query: { ...$route.query, tab: 'GALLERY' },
                  }">
                  <div>{{ $t('search.seeAll') }} --></div>
                </nuxt-link>
              </b-tab-item>
              <b-tab-item disabled label="User" value="User"> </b-tab-item>
            </b-tabs>
            <b-tabs
              v-show="!name"
              v-model="activeTrendingTab"
              class=""
              destroy-on-hide
              expanded>
              <b-tab-item label="Trending" value="Trending">
                <div
                  v-for="(item, idx) in defaultCollectionSuggestions"
                  :key="item.id"
                  :value="item"
                  :class="`mb-2 link-item ${
                    idx === selectedIndex ? 'selected-item' : ''
                  }`"
                  @click="gotoCollectionItem(item)">
                  <div class="media">
                    <div class="media-left">
                      <BasicImage
                        rounded
                        custom-class="is-64x64"
                        :src="item.image || '/placeholder.webp'" />
                    </div>
                    <div class="media-content">
                      <div class="pt-2 pr-2">
                        <span class="main-title name">{{ item.name }}</span>
                      </div>
                      <div
                        class="is-flex is-flex-direction-row is-justify-content-space-between pt-1 pr-2">
                        <span>Units: {{ item.total }}</span>
                        <span>Owners: {{ item.uniqueCollectors }}</span>
                        <span>{{ urlPrefix.toUpperCase() }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <nuxt-link :to="{ name: 'series-insight' }">
                  <div>{{ $t('search.rankings') }} --></div>
                </nuxt-link>
              </b-tab-item>
            </b-tabs>
          </template>
        </b-autocomplete>
        <div v-if="!isVisible && hideSearchInput">
          <div v-if="sliderDirty" class="is-size-7">
            <PriceRange :from="minPrice" :to="maxPrice" inline />
          </div>
        </div>
      </b-field>
      <b-field
        v-if="!hideFilter"
        expanded
        position="is-right"
        class="column is-4">
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
      v-model="isVisible"
      aria-id="sortAndFilter"
      animation="opacitySlide">
      <div class="columns mb-0">
        <Sort
          multiple-select
          class="column is-4 mb-0"
          :value="sortByMultiple"
          @input="updateSortBy($event, sortByMultiple)" />
        <BasicSwitch
          v-model="vListed"
          class="is-flex column is-4"
          :label="!replaceBuyNowWithYolo ? 'sort.listed' : 'YOLO'"
          size="is-medium"
          label-color="has-text-success" />
      </div>
      <div v-if="!hideFilter">
        <b-field class="columns mb-0">
          <b-input
            v-model="rangeSlider[0]"
            type="number"
            min="0"
            step="any"
            class="column is-2"
            :placeholder="$t('query.priceRange.minPrice')"
            data-cy="input-min">
          </b-input>
          <b-input
            v-model="rangeSlider[1]"
            min="0"
            step="any"
            type="number"
            class="column is-2"
            :placeholder="$t('query.priceRange.maxPrice')"
            data-cy="input-max">
          </b-input>
          <div class="column is-1">
            <b-button
              class="is-primary"
              :disabled="applyDisabled"
              data-cy="apply"
              @click="sliderChange(rangeSlider)">
              {{ $t('general.apply') }}
            </b-button>
          </div>
        </b-field>
        <p v-if="applyDisabled" class="help is-danger">
          {{ $t('query.priceRange.priceValidation') }}
        </p>
      </div>
      <div v-if="sliderDirty" class="is-size-7">
        <PriceRange :from="minPrice" :to="maxPrice" inline />
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Ref,
  Watch,
  mixins,
} from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { exist, existArray } from './exist'
import seriesInsightList from '@/queries/rmrk/subsquid/seriesInsightList.graphql'
import { SearchQuery } from './types'
import { denyList } from '@/utils/constants'
import {
  CollectionWithMeta,
  NFT,
  NFTWithMeta,
} from '@/components/rmrk/service/scheme'
import { getSanitizer } from '@/components/rmrk/utils'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import { logError, mapNFTorCollectionMetadata } from '~/utils/mappers'
import {
  getCloudflareImageLinks,
  processMetadata,
} from '~/utils/cachingStrategy'
import { fastExtract } from '~/utils/ipfs'
import { NFT_SQUID_SORT_CONDITION_LIST } from '@/utils/constants'
import resolveQueryPath from '@/utils/queryPathResolver'
import { unwrapSafe } from '~/utils/uniquery'
import ChainMixin from '~/utils/mixins/chainMixin'

const SearchPageRoutePathList = ['/collections', '/gallery', '/explore']

@Component({
  components: {
    Sort: () => import('./SearchSortDropdown.vue'),
    TypeTagInput: () => import('./TypeTagInput.vue'),
    Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
    BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
    PriceRange: () => import('@/components/shared/format/PriceRange.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
    // PreviewMediaResolver: () => import('@/components/rmrk/Media/PreviewMediaResolver.vue'), // TODO: need to fix CSS for model-viewer
  },
})
export default class SearchBar extends mixins(
  PrefixMixin,
  KeyboardEventsMixin,
  ChainMixin
) {
  @Prop(String) public search!: string
  @Prop(String) public type!: string
  @Prop({ type: Array, default: () => [] }) public sortByMultiple!: string[]
  @Prop(String) public searchColumnClass!: string
  @Prop({ type: Boolean, default: false }) public listed!: boolean
  @Prop(Boolean) public hideFilter!: boolean
  @Prop(Boolean) public hideSearchInput!: boolean
  @Ref('searchRef') readonly searchRef

  public isVisible = false
  private query: SearchQuery = {
    search: this.$route.query?.search?.toString() ?? '',
    type: this.$route.query?.type?.toString() ?? '',
    sortByMultiple: this.sortByMultiple ?? [],
    listed: this.$route.query?.listed?.toString() === 'true',
  }

  private first = 30
  private currentValue = 1
  private nftResult: NFTWithMeta[] = []
  private collectionResult: CollectionWithMeta[] = []
  private searchString = ''
  public name = ''
  private searched: NFT[] = []
  private rangeSlider: [
    number | string | undefined,
    number | string | undefined
  ] = [undefined, undefined]
  private sliderDirty = false
  private searchSuggestionEachTypeMaxNum = 5
  private bigNum = 1e10
  private keyDownNativeEnterFlag = true
  public defaultCollectionSuggestions: CollectionWithMeta[] = []
  public activeSearchTab = 'Collections'
  public activeTrendingTab = 'Trending'
  public selectedIndex = -1

  fetch() {
    this.fetchSuggestions()
  }

  get applyDisabled(): boolean {
    const [min, max] = this.rangeSlider as [
      string | undefined,
      string | undefined
    ]
    if (!min || !max) {
      return false
    }
    return parseFloat(min) > parseFloat(max)
  }

  get minPrice(): number | undefined {
    if (this.$route.query.min) {
      return parseFloat(this.$route.query.min.toString()) * 10 ** this.decimals
    }
    return undefined
  }

  get maxPrice(): number | undefined {
    if (this.$route.query.max) {
      return parseFloat(this.$route.query.max.toString()) * 10 ** this.decimals
    }
    return undefined
  }

  get showDefaultSuggestions() {
    return this.urlPrefix === 'rmrk'
  }

  public async fetchSuggestions() {
    if (this.showDefaultSuggestions) {
      try {
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
    existArray(this.$route.query.sort as string[], this.updateSortBy)
    exist(this.$route.query.listed, this.updateListed)
  }

  public created() {
    this.initKeyboardEventHandler({
      f: this.bindFilterEvents,
      k: this.bindSearchEvents,
    })
  }

  private bindSearchEvents(event) {
    event.preventDefault()
    if (event.key === 'k') {
      this.focusInput()
    }
  }

  private bindFilterEvents(event) {
    switch (event.key) {
      case 'b':
        this.updateListed(!this.vListed)
        break
      case 'n':
        this.updateSortBy(['BLOCK_NUMBER_DESC'])
        break
      case 'o':
        this.updateSortBy(['BLOCK_NUMBER_ASC'])
        break
      case 'e':
        this.updateSortBy(['PRICE_DESC'])
        break
      case 'c':
        this.updateSortBy(['PRICE_ASC'])
        break
    }
  }

  public focusInput(): void {
    this.searchRef?.focus()
  }

  get vListed(): boolean {
    this.query.listed = this.listed
    return this.listed
  }

  set vListed(
    listed: boolean | { listed: boolean; min?: string; max?: string }
  ) {
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
    return (
      searchResultExist && this.searchSuggestionEachTypeMaxNum !== this.bigNum
    )
  }

  get collectionSuggestion() {
    return this.collectionResult.slice(0, this.searchSuggestionEachTypeMaxNum)
  }

  get nftSuggestion() {
    return this.nftResult.slice(0, this.searchSuggestionEachTypeMaxNum)
  }

  get replaceBuyNowWithYolo(): boolean {
    return this.$store.getters['preferences/getReplaceBuyNowWithYolo']
  }

  public gotoGalleryItem(item: NFTWithMeta) {
    this.$router.push(`/${this.urlPrefix}/gallery/${item.id}`)
  }
  public gotoCollectionItem(item: CollectionWithMeta) {
    this.$router.push(`/${this.urlPrefix}/collection/${item.id}`)
  }

  @Emit('update:listed')
  @Debounce(50)
  updateListed(
    value: string | boolean | { listed: boolean; min?: string; max?: string }
  ): boolean {
    let v = ''
    if (typeof value === 'string' || typeof value === 'boolean') {
      v = String(value)
      this.replaceUrl({ listed: v })
    } else {
      const { listed, max, min } = value
      v = String(listed)
      this.replaceUrl({
        listed,
        max,
        min,
      })
    }
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
    this.replaceUrl({ type: value })
    return value
  }

  @Emit('update:sortByMultiple')
  @Debounce(400)
  updateSortBy(value: string[] | string, $event?): string[] {
    const final = (Array.isArray(value) ? value : [value]).filter((condition) =>
      NFT_SQUID_SORT_CONDITION_LIST.includes(condition)
    )
    const listed = final.some(
      (condition) => condition.toLowerCase().indexOf('price') > -1
    )
    if (listed && !this.vListed) {
      this.vListed = true
    }

    if ($event?.length > final.length || !$event) {
      this.replaceUrl({ sort: final })
      return final
    }
    let newFinal: string[] = []
    if (final.length > 0) {
      const newlySelected = final[final.length - 1].split('_')[0]
      newFinal = $event.filter(
        (option) => option.split('_')[0] !== newlySelected
      )
      newFinal.push(final[final.length - 1])
    }
    this.replaceUrl({ sort: newFinal })
    return newFinal
  }

  // not highlight search, just input keyword and enter
  nativeSearch() {
    if (this.selectedIndex === -1) {
      this.redirectToGalleryPageIfNeed()
      return
    }
    if (this.activeSearchTab === 'NFTs') {
      this.gotoGalleryItem(this.nftSuggestion[this.selectedIndex])
    } else {
      this.gotoCollectionItem(
        this.defaultCollectionSuggestions[this.selectedIndex]
      )
    }

    // this.searchRef?.blur()
  }

  onKeydownSelected(step: 1 | -1) {
    this.selectedIndex =
      (this.searchSuggestionEachTypeMaxNum + this.selectedIndex + step) %
      this.searchSuggestionEachTypeMaxNum
  }

  @Watch('activeSearchTab')
  watchActiveSearchTab() {
    this.resetSelectedIndex()
  }

  @Watch('name')
  watchSearchKey() {
    this.resetSelectedIndex()
  }

  resetSelectedIndex() {
    this.selectedIndex = -1
  }

  redirectToGalleryPageIfNeed() {
    if (SearchPageRoutePathList.indexOf(this.$route.path) === -1) {
      this.$router.replace({
        name: this.routeOf('explore'),
        query: {
          ...this.$route.query,
          tab:
            this.activeSearchTab === 'Collections' ? 'COLLECTION' : 'GALLERY',
        },
      })
    }
  }

  public routeOf(url: string): string {
    return `${this.urlPrefix}-${url}`
  }

  onBlur() {
    this.updateSearch(this.name)
  }

  @Emit('update:search')
  @Debounce(50)
  updateSearch(value: string): string {
    if (value !== this.searchQuery) {
      this.replaceUrl({ search: value ?? undefined })
    }
    return value
  }

  updatePriceMin(value: string) {
    const min = Number(value)
    if (!Number.isNaN(min)) {
      if (!this.sliderDirty) {
        this.sliderDirty = true
      }
      this.rangeSlider = [min, this.rangeSlider[1]]
      this.sliderChangeMin(min * 10 ** this.decimals)
    }
  }

  updatePriceMax(value: string) {
    const max = Number(value)
    if (!Number.isNaN(max)) {
      if (!this.sliderDirty) {
        this.sliderDirty = true
      }
      this.rangeSlider = [this.rangeSlider[0], max]
      this.sliderChangeMax(max * 10 ** this.decimals)
    }
  }

  // when user type some keyword, frontEnd will query related information
  @Debounce(50)
  async updateSuggestion(value: string) {
    this.searchString = value
    //To handle empty string
    if (!value) {
      // reset query-based search results once searchString is empty
      this.collectionResult = []
      this.nftResult = []
      return
    }

    this.query.search = value
    try {
      const queryNft = await resolveQueryPath(this.client, 'nftListWithSearch')
      const nfts = this.$apollo.query({
        query: queryNft.default,
        client: this.client,
        variables: {
          first: this.first,
          offset: this.offset,
          denyList,
          orderBy: this.query.sortByMultiple,
          search: this.buildSearchParam(),
        },
      })

      const {
        data: { nFTEntities },
      } = await nfts
      const nftList = unwrapSafe(nFTEntities)
      const metadataList: string[] = nftList.map(mapNFTorCollectionMetadata)
      getCloudflareImageLinks(metadataList).then((imageLinks) => {
        const nftResult: NFTWithMeta[] = []
        processMetadata<NFTWithMeta>(metadataList, (meta, i) => {
          nftResult.push({
            ...nftList[i],
            ...meta,
            image:
              (nftList[i]?.metadata &&
                imageLinks[fastExtract(nftList[i].metadata)]) ||
              getSanitizer(meta.image || '')(meta.image || ''),
            animation_url: getSanitizer(meta.animation_url || '')(
              meta.animation_url || ''
            ),
          })
        }).then(() => {
          this.nftResult = nftResult
        })
      })
    } catch (e) {
      logError(e, (msg) =>
        this.$consola.warn('[PREFETCH] Unable fo fetch', msg)
      )
    }
    try {
      const query = await resolveQueryPath(
        this.client,
        'collectionListWithSearch'
      )

      const collectionResult = this.$apollo.query({
        query: query.default,
        client: this.client,
        variables: {
          first: this.first,
          offset: this.offset,
          denyList,
          orderBy: this.query.sortByMultiple?.length
            ? this.query.sortByMultiple
            : undefined,
          search: this.buildSearchParam(),
        },
      })

      const {
        data: { collectionEntities },
      } = await collectionResult
      const collections = unwrapSafe(collectionEntities)
      const metadataList: string[] = collections.map(mapNFTorCollectionMetadata)
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
    } catch (e) {
      logError(e, (msg) =>
        this.$consola.warn('[PREFETCH] Unable fo fetch', this.offset, msg)
      )
    }
  }

  @Debounce(100)
  replaceUrl(queryCondition: { [key: string]: any }): void {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: {
          page: '1',
          ...this.$route.query,
          search: this.searchQuery || undefined,
          ...queryCondition,
        },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
    // if searchbar request or filter is set, pagination should always revert to page 1
    this.$emit('resetPage')
  }
  private buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []

    if (this.query.search) {
      params.push({ name_containsInsensitive: this.query.search })
    }

    if (this.query.listed) {
      params.push({ price_gt: '0' })
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

  public sliderChange([min, max]: [
    number | undefined,
    number | undefined
  ]): void {
    if (!this.sliderDirty) {
      this.sliderDirty = true
    }
    this.sliderChangeMin(min ? min * 10 ** this.decimals : undefined)
    this.sliderChangeMax(max ? max * 10 ** this.decimals : undefined)
    const priceMin = min ? String(min) : undefined
    const priceMax = max ? String(max) : undefined
    this.query.listed = true
    this.vListed = { listed: true, min: priceMin, max: priceMax }
  }

  @Emit('update:priceMin')
  @Debounce(50)
  private sliderChangeMin(min?: number): void {
    this.query.priceMin = min
  }

  @Emit('update:priceMax')
  @Debounce(50)
  private sliderChangeMax(max?: number): void {
    this.query.priceMax = max
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.gallery-search {
  .selected-item {
    border: 1px solid $primary;
  }
}

.link-item {
  cursor: pointer;
}

.media-content {
  .name {
    max-width: 34ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
