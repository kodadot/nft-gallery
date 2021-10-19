<template>
  <b-field>
    <b-select
      placeholder="Sort by"
      v-model="selectedAction"
    >
      <option v-for="action in actions" :value="action" :key="action">
        {{ $t('sort.' + action) }}
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts" >
import { Component, Vue, VModel } from 'vue-property-decorator'

@Component
export default class SearchSortDropdown extends Vue {
  @VModel({ type: String }) selectedAction!: string;

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
