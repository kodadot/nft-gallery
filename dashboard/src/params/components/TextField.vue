<template>
  <div class="arguments-wrapper">
    <b-field
      :label="`${argument.name}: ${argument.type}`"
    >
      <b-input v-model="arg" :disabled="disabled" />
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
const DEFAULT = '';

@Component({
  name: 'TextField'
})
export default class Text extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  set arg(value) {
    console.log('ArgumentHandler', { [this.argument.name.toString()]: value });

    this.$emit('selected', { [this.argument.name.toString()]: value });
  }

   get arg() {
    return this.defaultValue ? this.defaultValue : DEFAULT;
  }
}
</script>

<style scoped>
 .arguments-wrapper {
   margin: 1em 0em 0em 1em;
 }
</style>
