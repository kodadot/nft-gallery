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

  get selected() {
    return this.selectedMethod;
  }

  set selected(value) {
    this.$emit('selected', value);
  }
  @Prop() public methods!: string[];
  private label = 'submit the following extrinsic';
  private selectedMethod = null;

}
</script>
