<template>
  <div class="container">
    <FilterBar />
    <ResultBar />
    <QueryBar />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const components = {
  FilterBar: () => import('@/components/rmrk/Search/FilterBar.vue'),
  ResultBar: () => import('@/components/rmrk/Search/ResultBar.vue'),
  QueryBar: () => import('@/components/rmrk/Search/QueryBar.vue'),
};

@Component({ components })
export default class Search extends Vue {
}
</script>