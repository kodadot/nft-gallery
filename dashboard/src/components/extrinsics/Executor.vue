<template>
<div class="executor-select">
  <b-field :label="label">
    <b-select
            v-model="selected"
            :placeholder="label"
            expanded
    >
      <option
              v-for="method in methods"
              v-bind:key="method"
              :value="method"
      >{{ method }} </option>
    </b-select>
  </b-field>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Executor extends Vue {
  @Prop() public methods!: string[];
  @Prop() label!: string; 

  get selected() {
    return this.selectedMethod;
  }

  set selected(value) {
    this.$emit('selected', value);
  }
  
  private selectedMethod = null;

}
</script>
