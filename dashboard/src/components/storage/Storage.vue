<template>
  <div>
    <div class="executor-wrapper">
      <Executor
        :methods="sections"
        @selected="handleSectionSelection"
        label="select the following query"
      />
      <Executor
        :methods="methods"
        @selected="handleMethod"
        label="method"
      />
      <b-button class="chainstate-button" type="is-dark" icon-left="plus" @click="handleClick" />
    </div>
    <Argurments :args="args" @selected="handleSelectedArguments" />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins, Emit } from 'vue-property-decorator';
import Selection from '@/components/extrinsics/Selection.vue';
import Executor from '@/components/extrinsics/Executor.vue';
import Argurments from '@/components/extrinsics/Arguments.vue';
import ExtrinsicMixin from '@/utils/mixins/extrinsicsMixin'
import Connector from '@vue-polkadot/vue-api';
import extractParams, {StorageEntryPromise} from './extractParams'


const components = {
  Selection,
  Executor,
  Argurments,
}

@Component({ components })
export default class Storage extends Mixins(ExtrinsicMixin) {

  public mounted(): void {
    const { api } = Connector.getInstance()
    this.setSection(api.query)
  }

  protected handleMethod(value: string) {
    this.handleMethodSelection(value)
    // // TODO: do something with args
    const params = extractParams(this.getSection() as StorageEntryPromise)
    console.log('params',params);
  
    this.setArgs(params)
  }

  @Emit('click')
  public handleClick() {
    const { fnMethod, fnSection } = this.getFnMethodAndSection();
    return { key: `${fnSection}::${fnMethod}`, method: this.getSection(), args: this.mapArgs() }
  }
  

}
</script>

<style scoped>
.executor-wrapper {
  display: flex;
}

.executor-wrapper > * {
  flex: 1;
}

.chainstate-button {
  max-width: 4em;
  height: inherit;
  margin-left: 0.3em;
}
</style>
