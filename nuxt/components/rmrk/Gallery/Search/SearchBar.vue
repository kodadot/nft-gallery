<template>
  <div class="card mb-3 mt-5">
    <div class="card-content ">
      <div class="columns">
        <b-field class="column is-6 mb-0">
          <b-input
            placeholder="Search..."
            type="search"
            v-model="searchQuery"
            icon="search"
            expanded>
          </b-input>
        </b-field>
        <!-- disabled bc Viki needs add basic queries -->
        <!-- <b-field class="column is-3 mb-0">
          <b-button
            label="Sort & Filter"
            aria-controls="contentIdForA11y1"
            icon-right="caret-down"
            type="is-primary"
            expanded
            @click="isVisible = !isVisible"
            disabled
          />
        </b-field> -->
        <slot />
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
import { SortBy } from './types';
import shouldUpdate from '@/utils/shouldUpdate';
import { exist } from './exist'

@Component({
  components: {
    Sort: () => import('./SearchSortDropdown.vue'),
    TypeTagInput: () => import('./TypeTagInput.vue'),
    Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue')
  }
})
export default class SearchBar extends Vue {
  @Prop() public search!: string;
  @Prop() public type!: string;
  @Prop() public sortBy!: SortBy;
  private isVisible: boolean = false;
  private currentValue = 1;
  private total = 0;

  public mounted() {
    exist(this.$route.query.search, this.updateSearch);
    exist(this.$route.query.type, this.updateType);
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
  @Debounce(50)
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
        name: 'rmrk-gallery',
        query: { ...this.$route.query, search: this.searchQuery, type: this.typeQuery, [key]: value }
      })
      .catch(console.warn /*Navigation Duplicate err fix later */);
  }
}
</script>

<style lang="scss">
.card {
  box-shadow: 0px 0px 5px 0.5px #d32e79;
}
</style>
