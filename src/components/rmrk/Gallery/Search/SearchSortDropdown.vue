<template>
  <b-field>
    <b-select
      placeholder="Sort by"
      :value="selectedAction"
      @input="handleSelect"
    >
      <!-- <option value="">None</option> -->
      <option v-for="action in actions" :value="action[0]" :key="action[0]">
        {{ $t(action[0]) }}
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator'
import { SortType } from './types'

type Sort = Record<string, SortType>

@Component({})
export default class SearchSortDropdown extends Vue {
  private selectedAction = 'sort.created';
  private sortActions: Sort = {
  	'sort.created': { field: 'blockNumber', value: -1 },
  	'sort.old': { field: 'blockNumber', value: 1 },
  	'sort.lastChanged': { field: '_mod', value: -1 },
  	'sort.leastChanged': { field: '_mod', value: 1 },
  	'sort.priceDown': { field: 'price', value: -1 },
  	'sort.priceUp': { field: 'price', value: 1 },
  }

  handleSelect(name: string) {
  	this.selectedAction = name
  	this.handleInput(this.sortActions[name])
  }

  get actions(): [string, SortType][] {
  	return Object.entries(this.sortActions)
  }


  @Emit('input')
  handleInput({ field, value }: SortType) {
  	return { [field]: value }
  }

}
</script>
