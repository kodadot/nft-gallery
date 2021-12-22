<template>
  <div class="card mb-3 mt-5">
    <div class="card-content ">
      <div class="columns">
        <b-field class="column is-6 mb-0">

          <b-autocomplete
            v-model="name"
            :data = result
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
                  <div class="history"> {{props.option.name}} </div>
                </div>

                 <div v-else>
                   <nuxt-link
                    :to="{ name: 'rmrk-detail-id', params: { id: props.option.id }}"
                    tag="div"
                  >
                  <div class="media">
                  <div class="media-left">
                    <b-image class="image is-32x32"
                      :src="props.option.image === '' ? props.option.animation_url : props.option.image"
                    >
                    </b-image>
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
            aria-controls="contentIdForA11y1"
            icon-right="caret-down"
            type="is-primary"
            expanded
            @click="isVisible = !isVisible"
          />
        </b-field>
        <slot />
      </div>

      <transition  name="fade">
        <div v-if="isVisible" class="columns">
          <Sort class="column is-4 mb-0" :value="sortBy" @input="updateSortBy" />
          <BasicSwitch class="column is-4" v-model="vListed" label="sort.listed" size="is-medium" />
        </div>
      </transition>

    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { exist } from './exist'
import nftListWithSearch from '@/queries/nftListWithSearch.graphql'
import { SearchQuery } from './types'
import { denyList } from '@/constants'
import { NFT } from '../../service/scheme'
import { fetchNFTMetadata, getSanitizer } from '../../utils'
import { getMany, update } from 'idb-keyval'
import shouldUpdate from '~/utils/shouldUpdate'

@Component({
  components: {
    Sort: () => import('./SearchSortDropdown.vue'),
    TypeTagInput: () => import('./TypeTagInput.vue'),
    Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
    BasicImage: () => import('@/components/shared/view/BasicImage.vue'),

  }
})
export default class SearchBar extends Vue {
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

  get typeQuery(): string {
    return this.type
  }

  set typeQuery(value: string) {
    this.updateType(value)
  }
  get offset() {
    return this.currentValue * this.first - this.first
  }

  @Emit('update:listed')
  @Debounce(50)
  updateListed(value: string | boolean): boolean {
    const v = String(value)
    this.replaceUrl(v, 'listed')
    return v === 'true'
  }

  @Debounce(400)
  searchResult() {
    if(this.highlightPos)
      this.updateSelected(this.result[this.highlightPos])

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

  @Debounce(50)
  updateSelected(value: any){
    if(value.type == 'History'){
      this.updateSearch(value.name)
    }
    else{
      console.log(value.id)
      this.$router.push({name:'rmrk-detail-id', params: {id:value.id}})
    }
  }

  @Emit('update:search')
  @Debounce(400)
  updateSearch(value: string): string {
    shouldUpdate(value, this.searchQuery) && this.replaceUrl(value)
    return value
  }

  @Debounce(50)
  moveUp(){
    // console.log(this.name)
    this.highlightPos = Math.max(0, this.highlightPos-1)
  }

  @Debounce(50)
  moveDown(){
    // console.log(this.name)
    this.highlightPos = Math.min(this.result.length-1, this.highlightPos+1)
  }

  @Debounce(100)
  async updateSuggestion(value: string) {
    // shouldUpdate(value, this.searchQuery)
    this.query.search = value
    this.highlightPos = 0

    const nft = this.$apollo.query({
      query: nftListWithSearch,
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

    const storedMetadata = await getMany(
      nfts.map(({ metadata }: any) => metadata)
    )

    storedMetadata.forEach(async (m: { image: any }, i: string|number) => {
      if (!m) {
        try {
          const meta = await fetchNFTMetadata(nfts[i], getSanitizer(nfts[i].metadata, undefined, 'permafrost'))
          Vue.set(nfts, i, {
            ...nfts[i],
            ...meta,
            image: getSanitizer(meta.image || '')(meta.image || ''),
          })
          update(nfts[i].metadata, () => meta)
        } catch (e) {
          console.warn('[ERR] unable to get metadata')
        }
      } else {
        Vue.set(nfts, i, {
          ...nfts[i],
          ...m,
          image: getSanitizer(m.image || '')(m.image || ''),
        })
      }
    })

    this.result = this.filterSearch().concat(nfts)

    // console.log("here", this.result)
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
    this.result = this.searched
    // console.log(this.result)
  }

  private filterSearch(){
    return this.searched.filter(option => {
      return option.name.toString().toLowerCase().indexOf(this.name.toLowerCase()) >= 0
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
  box-shadow: 0px 0px 5px 0.5px $primary;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss">
.image img {
    width: 32px ;
    height: 32px ;
}
.history {
  color: #d32e79;
  font-size: 15px;
}

</style>
