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
import { getTypeDef } from '@polkadot/types';
import { TypeDef } from '@polkadot/types/types';


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
    // TODO: send Map<> with name (key) and type (meta.type.asPlain)
    const { fnMethod, fnSection } = this.getFnMethodAndSection();
    const storageEntryPromise: StorageEntryPromise = this.getSection() as StorageEntryPromise;
    let key: TypeDef = getTypeDef(storageEntryPromise.creator.meta.type.asPlain.toString());
    key.name = `${fnSection}::${fnMethod}`;
    console.log(key);
    
    return { key, method: this.getSection(), args: this.mapArgs() }
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
