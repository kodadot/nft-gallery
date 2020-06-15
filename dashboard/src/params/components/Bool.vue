<template>
<div class="arguments-wrapper">
  <b-field :label="`${argument.name}: ${argument.type}`">
    <b-select
            v-model="selected"
            :placeholder="`${argument.name}: ${argument.type}`"
            :disabled="disabled"
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
import { Unit } from '../types';


@Component
export default class Bool extends Vue {
  @Prop() private argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  private options = [
    { text: 'No', value: false },
    { text: 'Yes', value: true },
  ];

  get selected() {
    // TODO: Bool default value goes brrr
    return this.defaultValue || false
  }

  set selected(value: any) {
    this.$emit('selected', { [this.argument.name.toString()]: value });
  }

}
</script>

<style scoped>
 .arguments-wrapper {
   margin: 1em 0em 0em 1em;
 }
</style>
