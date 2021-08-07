<template>
  <div class="container">
    <FilterBar @select="selectCategory" />
    <ResultBar :category="category" />
    <QueryBar />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';

const components = {
  FilterBar: () => import('@/components/rmrk/Search/FilterBar.vue'),
  ResultBar: () => import('@/components/rmrk/Search/ResultBar.vue'),
  QueryBar: () => import('@/components/rmrk/Search/QueryBar.vue'),
};

@Component({ components })
export default class Search extends Vue {
  private category: string = '';

  @Emit('select')
  private selectCategory(category: string) {
    this.category = category;
  }
}
</script>