<template>
<div class="executor-select">
  <b-field :label="`${argument.name}: ${argument.type}`">
    <b-select
            v-model="selected"
            :placeholder="`${argument.name}: ${argument.type}`"
            expanded
    >
      <option
              v-for="method in argument.sub"
              v-bind:key="method.name"
              :value="method.name"
      >{{ method.name }} </option>
    </b-select>
  </b-field>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VoteThreshold extends Vue {
  @Prop() public argument!: any;


  get selected() {
    return '';
  }

  set selected(value) {
    this.$emit('selected', { [this.argument.name.toString()]: value });
  }



}
</script>
