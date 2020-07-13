<template>
  <div>
    <ArgumentHandler
      v-for="(arg, index) in fields"
      :argument="enhanceTypeDef(arg, index)"
      v-bind:key="index"
      @selected="selected"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { createType, getTypeDef } from '@polkadot/types';
import findComponent from '@/params/components/findComponent';
import registry from '@/params/components/typeRegistry';

@Component({
  name: 'Struct',
  components: {
    ArgumentHandler: () => import('@/components/extrinsics/ArgumentHandler.vue')
  },
})
export default class Struct extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any[];

  get fields(): any[] {
    return this.argument && this.argument.sub || [];
  }

  set arg(value) {
    console.log('ArgumentHandler', { [this.argument.name.toString()]: value });

    this.$emit('selected', { [this.argument.name.toString()]: value });
  }

  get arg() {
    return '';
  }

  public enhanceTypeDef(argument: any, index: number) {
    return { ...getTypeDef(createType(registry, argument.type).toRawType()), ...argument, name: index };
  }

  public selected(argument: any) {
    const component = findComponent(argument);
    return component;
  }
}
</script>
