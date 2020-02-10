<template>
  <div class="arguments-wrapper">
    <!-- <label><b>{{ argument.name }}: {{ argument.type }}</b></label> -->
    <component
      :is="selected(argument)"
      :argument="enhanceTypeDef(argument)"
      @selected="handleSelected"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import findComponent from '@/params/components/findComponent';
import { createType, getTypeDef } from '@polkadot/types';
import registry from '@/params/components/typeRegistry';

@Component({
  name: 'ArgumentHandler',
})
export default class ArgumentHandler extends Vue {
  @Prop() public argument!: any;

  public enhanceTypeDef(argument: any) {
    // return { ...argument }
    return {
      ...getTypeDef(createType(registry, argument.type).toRawType()),
      ...argument,
    };
  }

  public selected(argument: any) {
    const component = findComponent(argument);
    return component;
  }

  @Emit('selected')
  private handleSelected(value: any) {
    console.log('ArgumentHandler', value);
    return value;
  }
}
</script>

<style scoped>
.arguments-wrapper {
  margin: 1em 0em 0em 1em;
}
</style>