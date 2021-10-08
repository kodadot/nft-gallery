<template>
  <div class='tuple-argument-wrapper'>
  <ArgumentHandler
      class='tuple-argument-item'
      :argument="arg"
      :disabled="disabled"
      :defaultValue="value"
    />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
   name: 'Option',
   components: {
    ArgumentHandler: () => import('@/components/extrinsics/ArgumentHandler.vue'),
  }
})
export default class Option extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  get value() {
    return this.defaultValue && Object.fromEntries(Array.from(this.defaultValue.value));
  }

  get arg() {
    return this.argument && { ...this.argument.sub, name: this.argument.name }
  }

}
</script>

<style scoped>
@media only screen and (max-width: 425px) {
  .tuple-argument-item {
    margin: 0.5em 0 0 0;
  }
}
</style>
