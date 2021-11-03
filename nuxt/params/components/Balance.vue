<template>
  <div class="arguments-wrapper">
    <b-field
      :label="`${argument.name}: ${argument.type}`"
      class="balance"
    >
      <b-input
        v-model="arg"
        type="number"
        :disabled="disabled"
        step="0.001"
        min="0"
      />
      <p class="control balance">
        <b-select
          v-model="unitsSelected"
          :disabled="disabled"
        >
          <option
            v-for="u in units"
            :key="u.value"
            :value="u.value"
          >
            {{ u.name }}
          </option>
        </b-select>
      </p>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'nuxt-property-decorator'
import { isHex, hexToString, hexToBn, hexToNumber } from '@polkadot/util'
import { units as defaultUnits } from '@/params/constants'

@Component
export default class Balance extends Vue {

  set arg(value: number) {
    this.value = value
    this.handleSelected()
  }

  get arg() {
    const defaultValue = this.defaultValue && isHex(this.defaultValue)
      ? hexToBn(this.defaultValue as string).toString()
      : this.defaultValue

    if (defaultValue !== null && typeof defaultValue === 'object') {
      return defaultValue.toString()
    }

    return defaultValue || this.value
  }

  get chainProps() {
    return this.chainProperties
  }

  get units() {
    return [
      { name: 'femto', value: 1e-12*this.getChainDecimalsMultiplier()},
      { name: 'pico', value: 1e-9*this.getChainDecimalsMultiplier()},
      { name: 'nano', value: 1e-6*this.getChainDecimalsMultiplier()},
      { name: 'micro', value: 1e-3*this.getChainDecimalsMultiplier()},
      { name: 'mili', value: 1*this.getChainDecimalsMultiplier()},
      { name: this.getTokenSymbol(), value: 1e3*this.getChainDecimalsMultiplier()},
      { name: 'Kilo', value: 1e6 * this.getChainDecimalsMultiplier()},
      { name: 'Mega', value: 1e9 * this.getChainDecimalsMultiplier()},
      { name: 'Giga', value: 1e12 * this.getChainDecimalsMultiplier()},
      { name: 'Tera', value: 1e15 * this.getChainDecimalsMultiplier()},
      { name: 'Peta', value: 1e18 * this.getChainDecimalsMultiplier()},
      { name: 'Exa', value: 1e21 * this.getChainDecimalsMultiplier()},
      { name: 'Zeta', value: 1e24 * this.getChainDecimalsMultiplier()},
      { name: 'Yotta', value: 1e27 * this.getChainDecimalsMultiplier()},
    ]
  }

  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;


  private chainProperties: any = '-';
  private value = 0;
  private unitsSelected: number = 1e3*this.getChainDecimalsMultiplier();

  private getTokenSymbol(): string {
    this.chainProperties = this.$store.state.chainProperties
    if (this.chainProperties !== '-') {
      return this.chainProperties.tokenSymbol
    }
    return '-'
  }

  private getChainDecimalsMultiplier(): number {
    return 1*10**this.$store.state.chainProperties.tokenDecimals
  }

  @Watch('unitsSelected')
  private function() {
    this.handleSelected()
  }

  @Emit('selected')
  private handleSelected() {
    return { [this.argument.name.toString()]: this.arg * this.unitsSelected }
  }
}
</script>

<style scoped>
.arguments-wrapper > .balance > input {
  height: 2.6em !important;
}

.arguments-wrapper > .balance > .control.is-clearfix {
  flex: 1;
}

.arguments-wrapper {
   margin: 1em 0em 0em 1em;
 }

 @media only screen and (max-width: 425px) {
  .arguments-wrapper {
    margin: 0.5em 0 0 0;
  }
}
</style>
