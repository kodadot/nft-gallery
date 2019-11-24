<template>
<div class="executor-select">
  <b-field :label="`${argument.name}: ${argument.type}`">
    <b-select
            v-model="selected"
            :placeholder="`${argument.name}: ${argument.type}`"
            expanded
    >
      <option
              v-for="option in options"
              v-bind:key="option.text"
              :value="option.value"
      >{{ option.text }} </option>
    </b-select>
  </b-field>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Unit } from '../types'

@Component
export default class Bool extends Vue {
  const options = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];


  @Prop() public argument!: any;
  

  get selected() {
    return '';
  }

  set selected(value: any) {
    this.$emit('selected', value);
  }

}
</script>
