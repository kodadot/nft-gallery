<template>
  <div class="card mb-3 mt-5">
    <div class="card-content">
      <b-field >
        <b-input expanded placeholder="Search..." type="search" v-model="searchQuery" icon="search">
        </b-input>
      </b-field>
      <Sort @input="updateSortBy" />
      <TypeTagInput v-model="typeQuery" />
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Emit,  } from 'vue-property-decorator';
import { Debounce } from 'vue-debounce-decorator';
import { SearchQuery, SortBy } from './types'


@Component({
  components: {
    Sort: () => import('./SearchSortDropdown.vue'),
    TypeTagInput: () => import('./TypeTagInput.vue')
  }
})
export default class SearchBar extends Vue {
  @Prop() public search!: string;
  @Prop() public type!: string;
  @Prop() public sortBy!: SortBy;

  public mounted() {
    if (this.$route.query.search && typeof this.$route.query.search === 'string') {
      this.updateSearch(this.$route.query.search)
    }
  }


  get searchQuery() {
    return this.search
  }

  set searchQuery(value: string) {
    // this.replaceUrl(value)
    this.updateSearch(value)
  }

  get typeQuery() {
    return this.type
  }

  set typeQuery(value: string) {
    this.updateType(value)
  }


  @Emit('update:type')
  @Debounce(400)
  updateType(value: string) {
    return value
  }


  @Emit('update:sortBy')
  @Debounce(400)
  updateSortBy(value: SortBy) {
    console.log('Debounced', value)
    return value
  }


  @Emit('update:search')
  @Debounce(400)
  updateSearch(value: string) {
    console.log('Debounced', value)
    return value
  }

  @Debounce(400)
  replaceUrl(value: string) {
    if (this.search !== value) {
      this.$router.replace({ name: 'nft', query: {search: value} })
    }
  }

}
</script>
