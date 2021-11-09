<template>
  <div class="arguments-wrapper">
    <b-field
      :label="`${argument.name}: ${argument.type}`"
    >
      <b-input
        v-model="arg"
        :disabled="disabled"
      />
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
const DEFAULT = '0x0000000000000000000000000000000000000000000000000000000000000000'

@Component
export default class Hash256 extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  set arg(value) {
    console.log('ArgumentHandler', { [this.argument.name.toString()]: value })

    this.$emit('selected', { [this.argument.name.toString()]: value })
  }

  get arg() {
    return this.defaultValue ? this.defaultValue : DEFAULT
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
