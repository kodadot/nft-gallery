<template>
  <div class="arguments-wrapper">
    <b-field
      :label="`${argument.name}: ${argument.type}`"
    >
      <b-input v-model="arg" type="number" :disabled="disabled" step="0.001" min="0"
       />
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { isHex, hexToBn } from '@polkadot/util';

@Component
export default class Amount extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  set arg(value) {
    console.log('ArgumentHandler', { [this.argument.name.toString()]: value });

    this.$emit('selected', { [this.argument.name.toString()]: value });
  }

  get arg() {
    const defaultValue = isHex(this.defaultValue)
     ? hexToBn(this.defaultValue as string).toString()
     : this.defaultValue;


    console.log(this.defaultValue, isHex(this.defaultValue));


    return defaultValue ? defaultValue : 0;
  }


}
</script>

<style scoped>
 .arguments-wrapper {
   margin: 1em 0em 0em 1em;
 }

 @media only screen and (max-width: 425px) {
  .arguments-wrapper {
    margin: 0.5em 0 0 0;
  }
}
</style>
