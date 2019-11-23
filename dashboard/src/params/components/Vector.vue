<template>
  <div>
    <div class="buttons">
      <b-button @click="add" type="is-primary" icon-left="plus">
                Add
            </b-button>
            <b-button @click="remove" type="is-danger"
                icon-left="minus">
                Delete
            </b-button>
      </div>
      <ArgumentHandler v-for="(arg, index) in fields" :argument="enhanceTypeDef(arg, index)" v-bind:key="index" @selected="selected" />

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { createType, getTypeDef } from '@polkadot/types';
import findComponent from '@/params/components/findComponent';
import ArgumentHandler from '@/components/extrinsics/ArgumentHandler.vue';

@Component({
  components: {
    ArgumentHandler,
  },
})
export default class Vector extends Vue {
  @Prop() public argument!: any;
  private fields: any[] = [];

  public enhanceTypeDef(argument: any, index: number) {
    return { ...getTypeDef(createType(argument.type).toRawType()), ...argument, name: index };
  }

  public selected(argument: any) {
    const component = findComponent(argument);
    return component;
  }

  private add() {
    this.fields.push({ ...this.argument.sub });
  }

  private remove() {
    this.fields.pop();
  }

}
</script>
