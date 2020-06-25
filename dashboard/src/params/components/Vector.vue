<template>
  <div :class="{ 'vector-argument-wrapper': !disabled  }">
    <strong v-if="!disabled">
      {{argument.name}}: {{argument.type}}
    </strong>
    <div v-else class="buttons">
      <b-button @click="add" type="is-primary" icon-left="plus">
        Add
      </b-button>
      <b-button @click="remove" type="is-danger" icon-left="minus">
        Delete
      </b-button>
    </div>
    <div v-if="fields.length === 0 && !disabled">{{argument.name}} is empty!</div>
    <ArgumentHandler
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

@Component({
  name: 'Vector',
  components: {
    ArgumentHandler: () => import('../../components/extrinsics/ArgumentHandler.vue'),
  },
})
export default class Vector extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any[];

  private fields: any[] = [];
  private results: any[] = [];

  public enhanceTypeDef(argument: any, index: number) {
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
    if (this.defaultValue) {
      this.defaultValue.map((val) => this.add());
    }
  }

  public getDefaultValue(index: number) {
    return this.defaultValue && this.defaultValue[index];
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

<style scoped>
.vector-argument-wrapper {
  margin-left: 1em;
}
</style>
