<template>
  <div class="arguments-wrapper">
    <b-field :label="`${argument.name}: ${argument.type}`" class="balance">
      <b-input v-model="arg" type="number" :disabled="disabled" />
      <p class="control balance">
        <b-select v-model="unitsSelected" :disabled="disabled">
          <option v-for="u in units" v-bind:key="u.name" v-bind:value="u.value">
            {{ u.name }}
          </option>
        </b-select>
      </p>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { Unit } from '../types';

@Component
export default class Balance extends Vue {
  
  set arg(value: number) {
    this.value = value;
    this.handleSelected();
  }

  get arg() {
    return this.defaultValue || this.value;
  }

  get chainProps() {
    return this.chainProperties;
  }

  get units() { 
    return [
      { name: 'femto', value: 1e-15 },
      { name: 'pico', value: 1e-12 },
      { name: 'nano', value: 1e-9 },
      { name: 'micro', value: 1e-6 },
      { name: 'mili', value: 1e-3 },
      { name: this.getTokenSymbol(), value: 1 },
      { name: 'Kilo', value: 1e3 },
      { name: 'Mega', value: 1e6 },
      { name: 'Giga', value: 1e9 },
      { name: 'Tera', value: 1e12 },
      { name: 'Peta', value: 1e15 },
      { name: 'Exa', value: 1e18 },
      { name: 'Zeta', value: 1e21 },
      { name: 'Yotta', value: 1e24 },
    ];
  }

  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  private chainProperties = null;
  private value = 0;
  private unitsSelected: number = 1e-3;
  
  private getTokenSymbol(): string {
    if (this.chainProperties) {
      return this.chainProperties.tokenSymbol;
    }
    return '-';
  }

  @Watch('unitsSelected')
  private function() {
    this.handleSelected();
  }

  @Emit('selected')
  private handleSelected() {
    return { [this.argument.name.toString()]: this.arg * this.unitsSelected };
  }

  private async mounted(): Promise<void> {
    const { api } = (this as any).$http;
    this.chainProperties = await api.registry.getChainProperties();
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
</style>
