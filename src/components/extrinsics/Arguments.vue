<template>
  <div class="arguments-wrapper">
    <ArgumentHandler
      v-for="(arg, index) in args"
      :argument="arg"
      :disabled="disabled"
      v-bind:key="index"
      @selected="selected"
      :defaultValue="getDefaultValue(index)"
      :actionVisible="actionVisible"
      @action="action"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import ArgumentHandler from './ArgumentHandler.vue'

@Component({
  components: {
    ArgumentHandler,
  },
})
export default class Arguments extends Vue {
  @Prop() public args!: any[];
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValues!: any[];
  @Prop({ default: false }) public readonly actionVisible!: boolean;

  public getDefaultValue(index: number) {
    if (this.defaultValues) {
      try {
        return this.defaultValues[index].toJSON()
      } catch (e) {
        return this.defaultValues[index]
      }
    }
  }

  @Emit('selected')
  private selected(value: any) {
    return value
  }

  @Emit('action')
  private action(value: any) {
    return value
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
