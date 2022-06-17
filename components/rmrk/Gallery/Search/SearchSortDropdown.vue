<template>
  <b-field>
    <b-dropdown
      v-if="multipleSelect"
      multiple
      v-model="selectedAction"
      class="select-dropdown">
      <template #trigger>
        <b-button type="is-primary" icon-right="caret-down"> Sort by </b-button>
      </template>
      <b-dropdown-item v-for="action in actions" :key="action" :value="action">
        {{ $t('sort.' + action) }}
      </b-dropdown-item>
    </b-dropdown>
    <b-select
      v-else
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
import { Component, Vue, VModel, Prop } from 'nuxt-property-decorator'
import { NFT_SORT_CONDITION_LIST } from '@/utils/constants'
@Component
export default class SearchSortDropdown extends Vue {
  @VModel({ type: [Array, String] }) selectedAction!: string | string[]
  @Prop(Array) public sortOption?: string[]
  @Prop(Boolean) public multipleSelect!: boolean

  private sort: string[] = NFT_SORT_CONDITION_LIST

  get actions(): string[] {
    return this.sortOption || this.sort
  }
  created() {
    if (!this.selectedAction) {
      this.selectedAction = this.multipleSelect
        ? ['BLOCK_NUMBER_DESC']
        : 'blockNumber_DESC'
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.select-dropdown {
  select {
    border: 1px solid $primary !important;
  }
  @media screen and (max-width: 1216px) and (min-width: 768px) {
    width: 200px;
  }
}
</style>
