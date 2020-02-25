<template>
  <div class="arguments-wrapper">
    <ArgumentHandler
      v-for="(arg, index) in args"
      :argument="arg"
      :disabled="disabled"
      v-bind:key="arg.name.toString()"
      @selected="selected"
      :defaultValue="getDefaultValue(index)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import ArgumentHandler from './ArgumentHandler.vue';

@Component({
  components: {
    ArgumentHandler,
  },
})
export default class Arguments extends Vue {
  @Prop() public args!: any[];
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValues!: any[];

  public getDefaultValue(index: number) {
    return this.defaultValues && this.defaultValues[index].toJSON();
  }

  @Emit('selected')
  private selected(value: any) {
    console.log('Arguments', value);

    return value;
  }

}
</script>

<style scoped>
.arguments-wrapper {
  margin: 1em 0em 0em 1em;
}
</style>