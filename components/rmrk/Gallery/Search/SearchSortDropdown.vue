<template>
  <b-field>
    <b-select
      v-model="selectedAction"
      placeholder="Sort by"
      class="select-dropdown">
      <option v-for="action in actions" :key="action" :value="action">
        {{ $t('sort.' + action) }}
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, VModel } from 'nuxt-property-decorator'

@Component
export default class SearchSortDropdown extends Vue {
  @VModel({ type: String }) selectedAction!: string

  private sort: string[] = [
    'BLOCK_NUMBER_DESC',
    'BLOCK_NUMBER_ASC',
    'UPDATED_AT_DESC',
    'UPDATED_AT_ASC',
    'PRICE_DESC',
    'PRICE_ASC',
  ]

  get actions(): string[] {
    return this.sort
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.select-dropdown {
  select {
    border: 1px solid $primary!important;
  }
  @media screen and (max-width: 1216px) and (min-width: 768px) {
    width: 200px;
  }
}
</style>
