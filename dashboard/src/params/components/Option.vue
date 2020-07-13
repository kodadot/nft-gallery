<template>
  <div class='tuple-argument-wrapper'>
  <ArgumentHandler
      class='tuple-argument-item'
      :argument="argument.sub"
      :disabled="disabled"
      :defaultValue="defaultValue"
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
  @Prop({ default: null }) public readonly defaultValue!: any[];

}
</script>
