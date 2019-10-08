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
  private label = 'submit the following extrinsic';
  private selectedMethod = null;
  @Prop() methods!: string[];

  get selected() {
    return this.selectedMethod;
  }

  set selected(value) {
    this.$emit('selected', value);
  }

}
</script>
