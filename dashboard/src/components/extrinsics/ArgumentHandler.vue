<template>
  <div class="arguments-wrapper">
    
      <label><b>{{argument.name}}: {{argument.type}}</b></label>  
      <component :is="selected(argument)" :argument="enhanceTypeDef(argument)" />
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import findComponent from '@/params/components/findComponent';
import { createType, getTypeDef } from '@polkadot/types';

@Component
export default class ArgumentHandler extends Vue {
  @Prop() public argument!: any;

  set arg(value) {
    console.log('ArgumentHandler', { [this.argument.name.toString()]: value });

    this.$emit('selected', { [this.argument.name.toString()]: value });
  }

  get arg() {
    return '';
  }

  public enhanceTypeDef(argument: any) {
    return { ...getTypeDef(createType(argument.type).toRawType()), ...argument };
  }

  public selected(argument: any) {
    const component = findComponent(argument);
    console.log(component, argument, getTypeDef(createType(argument.type).toRawType()));
    return component;
  }


}
</script>

<style scoped>
 .arguments-wrapper {
   margin: 1em 0em 0em 1em;
 }
</style>