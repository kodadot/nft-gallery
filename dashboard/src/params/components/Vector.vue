<template>
  <div>
    <div class="buttons">
      <b-button @click="add" type="is-primary" icon-left="plus">
        Add
      </b-button>
      <b-button @click="remove" type="is-danger" icon-left="minus">
        Delete
      </b-button>
    </div>
    <ArgumentHandler
      v-for="(arg, index) in fields"
      :argument="enhanceTypeDef(arg, index)"
      v-bind:key="index"
      @selected="selected"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { createType, getTypeDef } from '@polkadot/types';
import findComponent from '@/params/components/findComponent';

@Component({
  name: 'Vector',
  components: {
    ArgumentHandler: () => import('../../components/extrinsics/ArgumentHandler.vue'),
  },
})
export default class Vector extends Vue {
  @Prop() public argument!: any;
  private fields: any[] = [];
  private results: any[] = [];

  public enhanceTypeDef(argument: any, index: number) {
    return {
      ...getTypeDef(createType(argument.type).toRawType()),
      ...argument,
      name: index,
    };
  }

  @Emit('selected')
  public selected(argument: any) {
    Object.keys(argument).map((arg: any) => this.results[arg] = argument[arg]);
    return { [this.argument.name.toString()]: this.results } ;
  }

  private add() {
    this.fields.push({ ...this.argument.sub });
    this.results.push(null);
  }

  private remove() {
    this.fields.pop();
    this.results.pop();
  }
}
</script>
