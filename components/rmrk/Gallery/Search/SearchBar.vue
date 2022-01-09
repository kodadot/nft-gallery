<template>
  <div class="card mb-3 mt-5">
    <div class="card-content">
      <div class="columns mb-0">
        <b-field class="column is-6 mb-0">
          <b-autocomplete
            v-model="name"
            :data="searchSuggestion"
            placeholder="Search..."
            icon="search"
            open-on-focus
            clearable
            max-height="350px"
            @keydown.native.enter="searchResult"
            @keydown.native.up="moveUp"
            @keydown.native.down="moveDown"
            @typing="updateSuggestion"
            @select="updateSelected"
            >
            <template slot-scope="props">

                <div v-if="props.option.type==='History'">
                  <div class="searchCache"> {{props.option.name}} </div>
                </div>

                 <div v-else>
                   <nuxt-link
                    :to="{ name: 'rmrk-detail-id', params: { id: props.option.id }}"
                    tag="div"
                  >
                  <div class="media">
                  <div class="media-left">
                    <BasicImage
                      customClass="is-32x32"
                      :src="props.option.image === '' ? props.option.animation_url : props.option.image"
                    />
                  </div>
                  <div class="media-content">
                      {{ props.option.name }}
                  </div>
                  </div>
                  </nuxt-link>
                </div>

            </template>
          </b-autocomplete>
        </b-field>
        <b-field class="column is-3 mb-0">
          <b-button
            label="Sort & Filter"
            aria-controls="sortAndFilter"
            :icon-right="isVisible ? 'chevron-up' : 'chevron-down'"
            type="is-primary"
            expanded
            @click="isVisible = !isVisible"
          />
        </b-field>
        <slot />
      </div>
      <b-collapse
        aria-id="sortAndFilter"
        animation="opacitySlide"
        v-model="isVisible"
      >
        <div class="columns">
          <Sort class="column is-4 mb-0" :value="sortBy" @input="updateSortBy" />
          <BasicSwitch class="is-flex column is-4" v-model="vListed" :label="!replaceBuyNowWithYolo ? 'sort.listed' : 'YOLO'" size="is-medium" labelColor="is-success" />
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { exist } from './exist'
import nftListWithSearch from '@/queries/nftListWithSearch.graphql'
import { SearchQuery } from './types'
import { denyList } from '@/utils/constants'
import { NFT } from '../../service/scheme'
import { fetchNFTMetadata, getSanitizer } from '../../utils'
import { getMany, update } from 'idb-keyval'
import shouldUpdate from '~/utils/shouldUpdate'
import PrefixMixin from '~/utils/mixins/prefixMixin'

@Component({
  components: {
    Sort: () => import('./SearchSortDropdown.vue'),
    TypeTagInput: () => import('./TypeTagInput.vue'),
    Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
    BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  }
})
export default class SearchBar extends mixins(PrefixMixin) {
  @Prop(String) public search!: string
  @Prop(String) public type!: string
  @Prop(String) public sortBy!: string
  @Prop(Boolean) public listed!: boolean

  protected isVisible = false
  private query: SearchQuery = {
    search: '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: false,
  }

  private first = 10
  private currentValue = 1
  private result : NFT[] = []
  private nfts : NFT[] = []
  private name = ''
  private searched : NFT[] = []
  private highlightPos = 0

  public mounted(): void {
    this.getSearchHistory()
    exist(this.$route.query.search, this.updateSearch)
    exist(this.$route.query.type, this.updateType)
    exist(this.$route.query.sort, this.updateSortBy)
    exist(this.$route.query.listed, this.updateListed)
  }

  get vListed(): boolean {
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

  get searchSuggestion(){
    return this.result.length !== 0 ? this.filterSearch().concat(this.result) : this.filterSearch()
  }

  get replaceBuyNowWithYolo(): boolean {
    return this.$store.getters['preferences/getReplaceBuyNowWithYolo']
  }

  @Emit('update:listed')
  @Debounce(50)
  updateListed(value: string | boolean): boolean {
    const v = String(value)
    this.replaceUrl(v, 'listed')
    return v === 'true'
  }

  searchResult() {
    if(this.highlightPos){

      const searchCache = this.filterSearch()
      if(this.highlightPos >= searchCache.length)
        this.updateSelected(this.result[this.highlightPos-searchCache.length])
      else
        this.updateSearch(searchCache[this.highlightPos].name)
    }

    if(!this.name)
      return

    if(!this.oldSearchResult(this.name)){
      const newResult = { 'type': 'History', 'name': this.name } as unknown as NFT
      this.searched.push(newResult)
      localStorage.kodaDotSearchResult = JSON.stringify(this.searched)
    }
    this.updateSearch(this.name)
  }

  @Emit('update:type')
  @Debounce(50)
  updateType(value: string): string {
    this.replaceUrl(value, 'type')
    return value
  }

  @Emit('update:sortBy')
  @Debounce(400)
  updateSortBy(value: string): string {
    this.replaceUrl(value, 'sort')
    return value
  }

  updateSelected(value: any){
    if(value.type == 'History'){
      this.updateSearch(value.name)
    }
    else{
      this.$router.push({name:'rmrk-detail-id', params: {id:value.id}})
    }
  }

  @Emit('update:search')
  @Debounce(50)
  updateSearch(value: string): string {
    shouldUpdate(value, this.searchQuery) && this.replaceUrl(value)
    return value
  }

  moveUp(){
    this.highlightPos = Math.max(0, this.highlightPos-1)
  }

  moveDown(){
    this.highlightPos = Math.min(this.result.length-1, this.highlightPos+1)
  }

  async updateSuggestion(value: string) {
    // shouldUpdate(value, this.searchQuery)
    this.query.search = value
    this.highlightPos = 0

    try{
      const nft = this.$apollo.query({
        query: nftListWithSearch,
        client: this.urlPrefix,
        variables: {
          first: this.first,
          offset: this.offset,
          denyList,
          orderBy: this.query.sortBy,
          search: this.buildSearchParam()
        }
      })
      const {
        data: {
          nFTEntities: { nodes: nfts }
        }
      } = await nft

      this.result = nfts
      const storedMetadata = await getMany(
        this.result.map(({ metadata }: any) => metadata)
      )

      storedMetadata.forEach(async (m: { image: any }, i: string|number) => {
        if (!m) {
          try {
            const meta = await fetchNFTMetadata(this.result[i], getSanitizer(this.result[i].metadata, undefined, 'permafrost'))
            Vue.set(this.result, i, {
              ...this.result[i],
              ...meta,
              image: getSanitizer(meta.image || '')(meta.image || ''),
            })
            update(this.result[i].metadata, () => meta)
          } catch (e) {
            console.warn('[ERR] unable to get metadata')
          }
        } else {
          Vue.set(this.result, i, {
            ...this.result[i],
            ...m,
            image: getSanitizer(m.image || '')(m.image || ''),
          })
        }
      })
    }catch (e: any) {
      console.warn('[PREFETCH] Unable fo fetch', this.offset, e.message)
    }

  }

  @Debounce(100)
  replaceUrl(value: string, key = 'search'): void {
    this.$router
      .replace({
        name: String(this.$route.name),
        query: { ...this.$route.query, search: this.searchQuery, [key]: value }
      })
      .catch(console.warn /*Navigation Duplicate err fix later */)
  }
  private buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []

    if (this.query.search) {
      params.push({
        name: { likeInsensitive: `%${this.query.search}%` }
      })
    }

    if (this.query.listed) {
      params.push({
        price: { greaterThan: '0' }
      })
    }

    return params
  }
  private getSearchHistory() {
    // localStorage.kodaDotSearchResult = ''
    const cacheResult = localStorage.kodaDotSearchResult
    if(cacheResult){
      this.searched = JSON.parse(cacheResult)
    }
  }

  private filterSearch(){
    if(!this.searched.length)
      return []
    return this.searched.filter(option => {
      return option.name.toString().toLowerCase().indexOf((this.name || '').toLowerCase()) >= 0
    })
  }

  private oldSearchResult(value: string): boolean{
    const res = this.searched.filter(r => r.name === value)
    return res.length ? true: false
  }
}

</script>

<style scoped lang="scss">
@import '@/styles/variables';

.b-skeleton{
  height: 32px !important;
  width: 32px !important;
  position: absolute;
  top: 0;
  left: 0;
}

.card {
  border: 2px solid $primary-light;
}

.searchCache {
  color: $primary;
  font-size: 15px;
}
</style>