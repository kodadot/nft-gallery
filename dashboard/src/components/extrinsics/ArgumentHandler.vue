<template>
  <div class="arguments-wrapper" v-bind:class="{ actionable: actionVisible }">
    <!-- <label><b>{{ argument.name }}: {{ argument.type }}</b></label> -->
    <component
      :is="selected(argument)"
      :argument="enhanceTypeDef(argument)"
      :disabled="disabled"
      @selected="handleSelected"
      :defaultValue="defaultValue"
      v-bind:class="{ big: actionVisible }"
    />
    <b-button v-if="actionVisible" class="argument-handler__delete-button" type="is-dark" icon-left="times" outlined @click="handleAction" />
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
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: boolean;
  @Prop({ default: false }) public readonly actionVisible!: boolean;

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

  @Emit('action')
  private handleAction() {
    return this.argument.name
  }
}
</script>

<style scoped>
.arguments-wrapper {
  margin: 1em 0em 0em 1em;
}

.argument-handler__delete-button {
  margin-top: 1em;
  padding: 1.5em;
}

.big {
  flex: 1;
}

.actionable {
  display: flex;
}

@media only screen and (max-width: 425px) {
  .actionable {
    flex-direction: column-reverse;
  }

  .argument-handler__delete-button {
    width: 4em;
    align-self: flex-end;
  }
}
</style>
