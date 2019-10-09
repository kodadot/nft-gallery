<template>
  <div class="arguments-wrapper">
    <ArgumentHandler v-for="(arg) in args" :argument="arg" v-bind:key="arg.name.toString()" @selected="selected" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import ArgumentHandler from './ArgumentHandler.vue';

@Component({
  components: {
    ArgumentHandler
  }
})
export default class Arguments extends Vue {
  @Prop() args!: any[];

  @Emit('selected')
  private selected(value) {
    console.log('Arguments', value);
    
    return value
  }

}
</script>

<style scoped>
 .arguments-wrapper {
   margin: 1em 0em 0em 1em;
 }
</style>