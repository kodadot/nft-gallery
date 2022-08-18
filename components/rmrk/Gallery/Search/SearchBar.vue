<template>
  <div class="mb-3">
    <div class="row" v-if="!isVisible && !hideSearchInput">
      <div v-if="sliderDirty && !hideFilter" class="is-size-7">
        <PriceRange :from="minPrice" :to="maxPrice" inline />
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
          @click="isVisible = !isVisible"
          data-cy="expand-search" />
        <slot name="next-filter"></slot>
        <b-autocomplete
          ref="searchRef"
          v-if="!hideSearchInput"
          class="gallery-search"
          v-model="name"
          placeholder="Search Artwork, Collection..."
          icon="search"
          open-on-focus
          clearable
          max-height="550px"
          dropdown-position="bottom"
          expanded
          @blur="onBlur"
          @typing="updateSuggestion"
          @keydown.native.enter="nativeSearch">
          <template #header>
            <b-tabs
              v-show="name"
              class="tabs-container-mobile"
              v-model="activeSearchTab"
              destroy-on-hide
              expanded>
              <b-tab-item label="Collections" value="Collections">
                <div
                  v-for="item in collectionSuggestion"
                  :value="item"
                  :key="item.id"
                  class="mb-2 link-item"
                  @click="gotoCollectionItem(item)">
                  <div class="media">
                    <div class="media-left">
                      <BasicImage
                        customClass="is-64x64 round-image"
                        :src="item.image || '/placeholder.webp'" />
                    </div>
                    <div class="media-content">
                      <div
                        class="is-flex is-flex-direction-row is-justify-content-space-between pt-2 pr-2">
                        <span class="name">{{ item.name }}</span>
                        <span>{{ urlPrefix.toUpperCase() }}</span>
                      </div>
                      <!-- <div class="is-flex is-flex-direction-row is-justify-content-space-between pt-1 pr-2">
                        <span>
                          Floor: <Money v-if="item.floorPrice && parseInt(item.floorPrice)" :value="item.floorPrice" inline/><span v-else>None</span>
                        </span>
                        <span>Units: {{  }}</span>

                      </div> -->
                    </div>
                  </div>
                </div>
                <nuxt-link
                  :to="{
                    name: routeOf('explore'),
                    query: { ...$route.query, tab: 'COLLECTION' },
                  }">
                  <div>See All --></div>
                </nuxt-link>
              </b-tab-item>
              <b-tab-item label="NFTs" value="NFTs">
                <div
                  v-for="item in nftSuggestion"
                  :value="item"
                  :key="item.id"
                  class="mb-2 link-item"
                  @click="gotoGalleryItem(item)">
                  <div class="media">
                    <div class="media-left">
                      <BasicImage
                        customClass="is-64x64 round-image"
                        :src="item.image || '/placeholder.webp'" />
                    </div>
                    <div class="media-content">
                      <div
                        class="is-flex is-flex-direction-row is-justify-content-space-between pt-2 pr-2">
                        <span class="name">{{ item.name }}</span>
                        <span>{{ urlPrefix.toUpperCase() }}</span>
                      </div>
                      <div
                        class="is-flex is-flex-direction-row is-justify-content-space-between pt-1 pr-2">
                        <span>{{ item.collection?.name }}</span>
                        <span>
                          Price:
                          <Money
                            v-if="item.price && parseInt(item.price)"
                            :value="item.price"
                            inline /><span v-else>None</span>
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
                  <div>See All --></div>
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
                  v-for="item in defaultCollectionSuggestions"
                  :key="item.id"
                  :value="item"
                  class="mb-2 link-item"
                  @click="gotoCollectionItem(item)">
                  <div class="media">
                    <div class="media-left">
                      <BasicImage
                        customClass="is-64x64 round-image"
                        :src="item.image || '/placeholder.webp'" />
                    </div>
                    <div class="media-content">
                      <div class="pt-2 pr-2">
                        <span class="name">{{ item.name }}</span>
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
                  <div>Rankings --></div>
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
        <Sort
          multipleSelect
          class="column is-4 mb-0"
          :value="sortByMultiple"
          @input="updateSortBy($event, sortByMultiple)" />
        <BasicSwitch
          class="is-flex column is-4"
          v-model="vListed"
          :label="!replaceBuyNowWithYolo ? 'sort.listed' : 'YOLO'"
          size="is-medium"
          labelColor="has-text-success" />
      </div>
      <div v-if="!hideFilter">
        <b-field class="columns mb-0">
          <b-input
            type="number"
            min="0"
            step="any"
            class="column is-2"
            :placeholder="$t('query.priceRange.minPrice')"
            v-model="rangeSlider[0]"
            data-cy="input-min">
          </b-input>
          <b-input
            min="0"
            step="any"
            type="number"
            class="column is-2"
            :placeholder="$t('query.priceRange.maxPrice')"
            v-model="rangeSlider[1]"
            data-cy="input-max">
          </b-input>
          <div class="column is-1">
            <b-button
              class="is-primary"
              @click="sliderChange(rangeSlider)"
              :disabled="applyDisabled"
              data-cy="apply">
              {{ $t('general.apply') }}
            </b-button>
          </div>
        </b-field>
        <p class="help is-danger" v-if="applyDisabled">
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
import { Component, Prop, Emit, mixins, Ref } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { exist, existArray } from './exist'
import seriesInsightList from '@/queries/rmrk/subsquid/seriesInsightList.graphql'
import lastNftListByEvent from '@/queries/rmrk/subsquid/lastNftListByEvent.graphql'
import { SearchQuery, SearchSuggestion } from './types'
import { denyList } from '@/utils/constants'
import { NFT, NFTWithMeta, CollectionWithMeta } from '../../service/scheme'
import { getSanitizer } from '../../utils'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import { logError, mapNFTorCollectionMetadata } from '~/utils/mappers'
import {
  getCloudflareImageLinks,
  processMetadata,
} from '~/utils/cachingStrategy'
import { fastExtract } from '~/utils/ipfs'
import { convertLastEventToNft } from '@/utils/carousel'
import { NFT_SQUID_SORT_CONDITION_LIST } from '@/utils/constants'
import { LastEvent } from '~/utils/types/types'
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
  @Prop(Boolean) public showDefaultSuggestions!: boolean
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
  private name = ''
  private searched: NFT[] = []
  private rangeSlider: [
    number | string | undefined,
    number | string | undefined
  ] = [undefined, undefined]
  private sliderDirty = false
  private searchSuggestionEachTypeMaxNum = 5
  private bigNum = 1e10
  private keyDownNativeEnterFlag = true
  private defaultNFTSuggestions: NFTWithMeta[] = []
  public defaultCollectionSuggestions: CollectionWithMeta[] = []
  public activeSearchTab = 'Collections'
  public activeTrendingTab = 'Trending'

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

  public async fetchSuggestions() {
    if (this.showDefaultSuggestions) {
      try {
        const { data } = await this.$apollo.query<{
          events: LastEvent[]
        }>({
          query: lastNftListByEvent,
          client: this.client,
          variables: {
            limit: this.searchSuggestionEachTypeMaxNum,
            event: 'LIST',
          },
        })

        const nfts = [...data.events].map((e) => convertLastEventToNft(e).nft)

        const nFTMetadataList: string[] = (nfts as any).map(
          mapNFTorCollectionMetadata
        )
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
            console.log('jarsen defaultCollectionSuggestions', collectionResult)
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
    this.keyDownNativeEnterFlag = true
    setTimeout(() => {
      if (this.keyDownNativeEnterFlag) {
        this.updateSelected({
          type: 'Search',
          name: this.searchString,
        })
        this.redirectToGalleryPageIfNeed()
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
      this.$router.push({
        name: this.routeOf('detail-id'),
        params: { id: value.id },
      })
    } else if (
      value.__typename === 'CollectionEntity' ||
      value.__typename === 'Series'
    ) {
      this.$router.push({
        name: this.routeOf('collection-id'),
        params: { id: value.id },
      })
    }
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
    if (value && value !== this.searchQuery) {
      this.replaceUrl({ search: value })
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
      const queryNft = await resolveQueryPath('subsquid', 'nftListWithSearch')
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
        'subsquid',
        'collectionListWithSearch'
      )

      const collectionResult = this.$apollo.query({
        query: query.default,
        client: 'subsquid',
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
@import '@/styles/variables';

.round-image {
  border-radius: 64px;
  overflow: hidden;
  border: 1px solid black;
}
.link-item {
  cursor: pointer;
}

.media-content {
  color: gray;
  .name {
    color: black;
  }
}
</style>
