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
      <b-button class="chainstate-button" type="is-dark" icon-left="plus" @click="handleClick" :disabled="hasArgs()"  />
    </div>
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
import { ConstantCodec } from '@polkadot/metadata/Decorated/types';


const components = {
  Selection,
  Executor,
  Argurments,
}

@Component({ components })
export default class Constants extends Mixins(ExtrinsicMixin) {

  public mounted(): void {
    const { api } = Connector.getInstance()
    this.setSection(api.consts)
  }

  protected handleMethod(value: string) {
    this.handleMethodSelection(value)

    const params: any[] = []
    console.log('params',[]);
  
    this.setArgs(params)
  }

  @Emit('click')
  public handleClick() {
    // TODO: send Map<> with name (key) and type (meta.type.asPlain)
    const { fnMethod, fnSection } = this.getFnMethodAndSection();
    const constantCodecPromise: ConstantCodec = this.getSection() as ConstantCodec;
    const key: TypeDef = { ...getTypeDef(constantCodecPromise.meta.type.toString()), name: `${fnSection}::${fnMethod}` };
    console.log(key);
    
    return { key, method: this.getSection(), args: this.mapArgs(), isConst: true }
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

@media only screen and (max-width: 425px) {
  .executor-wrapper {
    flex-direction: column;
  }
  
  .chainstate-button {
    max-width: inherit;
    margin-left: 0;
    margin-top: 1em;
  }
}
</style>
