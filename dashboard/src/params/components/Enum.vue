<template>
<div class="executor-select">
  {{ JSON.stringify(argument.sub) }}
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
export default class Executor extends Vue {
  @Prop() public argument!: any;
  private selectedMethod = null;

  get selected() {
    return this.selectedMethod;
  }

  set selected(value) {
    this.$emit('selected', value);
  }

  

}
</script>
