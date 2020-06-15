<template>
<div class='tuple-argument-wrapper'>
  <ArgumentHandler
      class='tuple-argument-item'
      v-for="(arg, index) in fields"
      :argument="enhanceTypeDef(arg, index)"
      v-bind:key="index"
      :disabled="disabled"
      @selected="selected"
      :defaultValue="getDefaultValue(index)"
    />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { createType, getTypeDef } from '@polkadot/types';
import findComponent from '@/params/components/findComponent';
import registry from '@/params/components/typeRegistry';
import { ITuple } from '@polkadot/types/types';

@Component({
  name: 'Tuple',
  components: {
    ArgumentHandler: () => import('../../components/extrinsics/ArgumentHandler.vue'),
  }
})
export default class Tuple extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any[];

  private fields: any[] = [];
  private results: any[] = [];

    public unwrapTuple(argument: any): any {
      console.log(argument);
      
      return [this.enhanceTypeDef(argument.sub[0], 0), this.enhanceTypeDef(argument.sub[1], 1)]
    }

    public enhanceTypeDef(argument: any, index: number) {
      console.log('Tuple', argument);
      
    return {
      ...getTypeDef(createType(registry, argument.type).toRawType()),
      ...argument,
      name: index,
    };
  }

  @Emit('selected')
  public selected(argument: any) {
    Object.keys(argument).map((arg: any) => this.results[arg] = argument[arg]);
    return { [this.argument.name.toString()]: this.results };
  }

  public mounted() {
    this.fields = this.unwrapTuple(this.argument);
    if (this.defaultValue) {
      this.defaultValue.map(() => this.results.push(null));
    }
  }

  public getDefaultValue(index: number) {
    return this.defaultValue && this.defaultValue[index];
  }

}
</script>
<style scoped>
.tuple-argument-wrapper {
  display: flex;
}

.tuple-argument-wrapper .tuple-argument-item {
  flex-grow: 1;
  margin-top: 0;
  margin-left: 0.1em;
}


</style>
