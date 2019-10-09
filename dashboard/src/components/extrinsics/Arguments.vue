<template>
  <div class="arguments-wrapper">
    <b-field
      v-for="(arg) in args"
      v-bind:key="arg.name.toString()"
      :label="`${arg.name}: ${arg.type}`"
    >
      <b-input   />
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Arguments extends Vue {
  @Prop() args!: any[];

}
</script>

<style scoped>
 .arguments-wrapper {
   margin: 1em 0em 0em 1em;
 }
</style>