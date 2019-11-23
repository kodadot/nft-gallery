<template>
  <div class="arguments-wrapper ">
    <b-field
      :label="`${argument.name}: ${argument.type}`"
      
      class="balance"
      
    >
      <b-input v-model="arg" type="number"/>
      <p class="control">
        <b-select v-model="unitsSelected">
          <option v-for="u in units"
            v-bind:key="u.name"
            v-bind:value="u.value">
            {{u.name}}
          </option>
        </b-select>
      </p>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Unit } from '../types';

@Component
export default class Balance extends Vue {

  set arg(value: number) {
    console.log('Balance', { [this.argument.name.toString()]: value * this.unitsSelected });

    this.$emit('selected', { [this.argument.name.toString()]: value * this.unitsSelected });
  }

  get arg() {
    return 0;
  }

  @Prop() public argument!: any;
    private unitsSelected: number = 1e-3;
    private units: Unit[] = [
    {name: 'femto', value: 1e-15}, {name: 'pico', value: 1e-12}, {name: 'nano', value: 1e-9},
    {name: 'micro', value: 1e-6}, {name: 'mili', value: 1e-3}, {name: 'DOT', value: 1},
    {name: 'Kilo', value: 1e3}, {name: 'Mega', value: 1e6}, {name: 'Giga', value: 1e9},
    {name: 'Tera', value: 1e12}, {name: 'Peta', value: 1e15}, {name: 'Exa', value: 1e18},
    {name: 'Zeta', value: 1e21}, {name: 'Yotta', value: 1e24},
  ];
}
</script>

<style scoped>
  .arguments-wrapper > .balance > input {
    height: 2.6em !important;
  }
</style>
