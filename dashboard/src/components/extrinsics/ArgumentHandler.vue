<template>
  <div class="arguments-wrapper">
    <b-field
      :label="`${argument.name}: ${argument.type}`"
    >
      <b-input v-model="arg" />
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ArgumentHandler extends Vue {
  @Prop() argument!: any;

  set arg(value) {
    console.log('ArgumentHandler', { [this.argument.name.toString()]: value });
    
    this.$emit('selected', { [this.argument.name.toString()]: value })
  }

  get arg() {
    return ''
  }


}
</script>

<style scoped>
 .arguments-wrapper {
   margin: 1em 0em 0em 1em;
 }
</style>