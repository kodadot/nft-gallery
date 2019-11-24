<template>
<div>
  <ArgumentHandler v-for="(arg, index) in fields" :argument="enhanceTypeDef(arg, index)" v-bind:key="index" @selected="selected" />
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ArgumentHandler from '@/components/extrinsics/ArgumentHandler.vue';
import { createType, getTypeDef } from '@polkadot/types';
import findComponent from '@/params/components/findComponent';

@Component({
  name: 'Struct',
  components: {
    ArgumentHandler,
  },
})
export default class Struct extends Vue {
   @Prop() public argument!: any;

  get fields(): any[] {
    return this.argument && this.argument.sub || []
  } 

  set arg(value) {
    console.log('ArgumentHandler', { [this.argument.name.toString()]: value });

    this.$emit('selected', { [this.argument.name.toString()]: value });
  }

  get arg() {
    return '';
  }

  public enhanceTypeDef(argument: any, index: number) {
    return { ...getTypeDef(createType(argument.type).toRawType()), ...argument, name: index };
  }

  public selected(argument: any) {
    const component = findComponent(argument);
    return component;
  }
}
</script>
