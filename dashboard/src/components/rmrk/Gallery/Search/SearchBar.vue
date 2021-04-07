<template>
  <div class="card mb-3 mt-5">
    <div class="card-content">
      <b-field >
        <b-input expanded placeholder="Search..." type="search" v-model="searchQuery" icon="search">
        </b-input>
      </b-field>
      <Sort />
      <TypeTagInput/>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { Debounce } from 'vue-debounce-decorator';
import { SearchQuery } from './types'


@Component({
  components: {
    Sort: () => import('./SearchSortDropdown.vue'),
    TypeTagInput: () => import('./TypeTagInput.vue')
  }
})
export default class SearchBar extends Vue {
  @Prop() public query!: SearchQuery;

  public mounted() {
    if (this.$route.query.search && typeof this.$route.query.search === 'string') {
      this.update(this.$route.query.search)
    }
  }


  get searchQuery() {
    return this.query.query
  }

  set searchQuery(value: string) {
    this.replaceUrl(value)
    this.update(value)
  }

  @Emit('update:query')
  @Debounce(400)
  update(value: string) {
    console.log('Debounced', value)
    return value
  }

  @Debounce(400)
  replaceUrl(value: string) {
    if (this.query.query !== value) {
      this.$router.replace({ name: 'nft', query: {search: value} })
    }
  }

}
</script>
