<template>
  <div class="card mb-3 mt-5">
    <div class="card-content">
      <b-field >
        <b-input expanded placeholder="Search..." type="search" v-model="searchQuery" icon="search">
        </b-input>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { Debounce } from 'vue-debounce-decorator';

@Component({})
export default class SearchBar extends Vue {
  @Prop() public query!: string;


  get searchQuery() {
    return this.query
  }

  set searchQuery(value: string) {
    this.update(value)
  }

  @Emit('update:query')
  @Debounce(400)
  update(value: string) {
    console.log('Debounced', value)
    return value
  }

}
</script>
