<template>
  <div class="card mb-3 mt-5">
    <div class="card-content ">
      <div class="columns">
        <b-field class="column is-2 mb-0">
          <b-button
            label="Sort & Filter"
            aria-controls="contentIdForA11y1"
            icon-right="caret-down"
            type="is-primary"
            outlined
            expanded
            @click="isVisible = !isVisible"
          />
        </b-field>
        <b-field class="column">
          <b-input
            placeholder="Search..."
            type="search"
            v-model="searchQuery"
            icon="search"
          >
          </b-input>
        </b-field>
      </div>

      <div v-if="isVisible" class="columns">
        <Sort class="column is-2 mb-0" @input="updateSortBy" />
        <TypeTagInput class="column" v-model="typeQuery" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { Debounce } from 'vue-debounce-decorator';
import { SearchQuery, SortBy } from './types';
import shouldUpdate from '@/utils/shouldUpdate';

type StringOrNull = string | null;
const exist = (value: string | StringOrNull[], cb: (arg: string) => {}) => {
  if (value && typeof value === 'string') {
    cb(value);
  }
};

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
  private isVisible: boolean = false;

  public mounted() {
    exist(this.$route.query.search, this.updateSearch);
    exist(this.$route.query.type, this.updateType);
    // console.log('query', this.$route.query)
    // if (
    //   this.$route.query.search &&
    //   typeof this.$route.query.search === 'string'
    // ) {
    //   this.updateSearch(this.$route.query.search);
    // }
  }

  get searchQuery() {
    return this.search;
  }

  set searchQuery(value: string) {
    this.updateSearch(value);
  }

  get typeQuery() {
    return this.type;
  }

  set typeQuery(value: string) {
    this.updateType(value);
  }

  @Emit('update:type')
  @Debounce(400)
  updateType(value: string) {
    this.replaceUrl(value, 'type');
    return value;
  }

  @Emit('update:sortBy')
  @Debounce(400)
  updateSortBy(value: SortBy) {
    console.log('Debounced', value);
    // this.replaceUrl(value)
    return value;
  }

  @Emit('update:search')
  @Debounce(400)
  updateSearch(value: string) {
    console.log('Debounced', value);
    shouldUpdate(value, this.searchQuery) && this.replaceUrl(value);
    return value;
  }

  @Debounce(100)
  replaceUrl(value: string, key = 'search') {
    this.$router
      .replace({
        name: 'nft',
        query: { search: this.searchQuery, type: this.typeQuery, [key]: value }
      })
      .catch(console.warn /*Navigation Duplicate err fix later */);
  }
}
</script>
