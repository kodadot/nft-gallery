<template>
  <div class="card mb-4 p-4">
    <b-button
      v-for="(category, key) in categories"
      v-bind:key="key"
      @click="selectCategory(category)"
      :type="selectedCategory == category ? 'is-link' : 'is-primary'"
      class="ml-2 my-2"
    >
      {{ category }}
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import { Categories } from './helper';

@Component({})
export default class FilterBar extends Vue {
  private categories = Categories;
  private selectedCategory: string = '';

  @Emit('select')
  public selectCategory(category: string) {
    this.selectedCategory = category;
    return category;
  }
}
</script>

<style lang="scss" scoped>
.card {
  box-shadow: 0px 0px 5px 0.5px #d32e79;
}
</style>