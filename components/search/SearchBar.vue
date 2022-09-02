<template>
  <div class="mb-3">
    <div v-if="!isVisible && !hideSearchInput" class="row">
      <div v-if="priceRangeDirty && !hideFilter" class="is-size-7">
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
        <SearchBarInput
          v-if="!hideSearchInput"
          v-model="vName"
          :query="query"
          @enter="nativeSearch"
          @blur="onBlur"></SearchBarInput>
        <div v-if="!isVisible && hideSearchInput">
          <div v-if="priceRangeDirty" class="is-size-7">
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
      <SearchPriceRange
        v-if="!hideFilter"
        :range="priceRange"
        @input="priceRangeChange"></SearchPriceRange>
      <div v-if="priceRangeDirty" class="is-size-7">
        <PriceRange :from="minPrice" :to="maxPrice" inline />
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { exist, existArray } from './exist'
import { SearchQuery } from './types'
import { NFT } from '@/components/rmrk/service/scheme'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import { NFT_SQUID_SORT_CONDITION_LIST } from '@/utils/constants'
import ChainMixin from '~/utils/mixins/chainMixin'

@Component({
  components: {
    Sort: () => import('./SearchSortDropdown.vue'),
    SearchBarInput: () => import('./SearchBarInput.vue'),
    SearchPriceRange: () => import('./SearchPriceRange.vue'),
    Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
    BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
    PriceRange: () => import('@/components/shared/format/PriceRange.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
  },
})
export default class extends mixins(
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
  public isVisible = false
  public query: SearchQuery = {
    search: this.$route.query?.search?.toString() ?? '',
    type: this.$route.query?.type?.toString() ?? '',
    sortByMultiple: this.sortByMultiple ?? [],
    listed: this.$route.query?.listed?.toString() === 'true',
  }

  private searchString = ''
  public name = ''
  private searched: NFT[] = []
  public priceRange: [
    number | string | undefined,
    number | string | undefined
  ] = [undefined, undefined]
  public priceRangeDirty = false

  get vName() {
    return this.name
  }

  set vName(value: string) {
    this.name = value
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

  public mounted(): void {
    this.getSearchHistory()
    exist(this.$route.query.search, this.updateSearch)
    exist(this.$route.query.min, this.updatePriceMin)
    exist(this.$route.query.max, this.updatePriceMax)
    existArray(this.$route.query.sort as string[], this.updateSortBy)
    exist(this.$route.query.listed, this.updateListed)
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

  public created() {
    this.initKeyboardEventHandler({
      f: this.bindFilterEvents,
    })
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

  get replaceBuyNowWithYolo(): boolean {
    return this.$store.getters['preferences/getReplaceBuyNowWithYolo']
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
      if (!this.priceRangeDirty) {
        this.priceRangeDirty = true
      }
      this.priceRange = [min, this.priceRange[1]]
      this.priceRangeChangeMin(min)
    }
  }

  updatePriceMax(value: string) {
    const max = Number(value)
    if (!Number.isNaN(max)) {
      if (!this.priceRangeDirty) {
        this.priceRangeDirty = true
      }
      this.priceRange = [this.priceRange[0], max]
      this.priceRangeChangeMax(max)
    }
  }

  nativeSearch() {
    this.updateSearch(this.name)
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

  private getSearchHistory() {
    // localStorage.kodaDotSearchResult = ''
    const cacheResult = localStorage.kodaDotSearchResult
    if (cacheResult) {
      this.searched = JSON.parse(cacheResult)
    }
  }

  public priceRangeChange([min, max]: [
    number | undefined,
    number | undefined
  ]): void {
    if (!this.priceRangeDirty) {
      this.priceRangeDirty = true
    }
    this.priceRangeChangeMin(min)
    this.priceRangeChangeMax(max)
    const priceMin = min ? String(min) : undefined
    const priceMax = max ? String(max) : undefined
    this.query.listed = true
    this.vListed = { listed: true, min: priceMin, max: priceMax }
  }

  @Emit('update:priceMin')
  @Debounce(50)
  private priceRangeChangeMin(min?: number): void {
    this.query.priceMin = min ? min * 10 ** this.decimals : undefined
  }

  @Emit('update:priceMax')
  @Debounce(50)
  private priceRangeChangeMax(max?: number): void {
    this.query.priceMax = max ? max * 10 ** this.decimals : undefined
  }
}
</script>
