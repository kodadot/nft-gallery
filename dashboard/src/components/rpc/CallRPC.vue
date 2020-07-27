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
      <b-button class="chainstate-button" type="is-dark" icon-left="plus" @click="handleClick" :disabled="disabled"  />
    </div>
    <Argurments v-if="params.length" :args="params" @selected="handleSelectedArguments" />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins, Emit } from 'vue-property-decorator';
import Selection from '@/components/extrinsics/Selection.vue';
import Executor from '@/components/extrinsics/Executor.vue';
import Argurments from '@/components/extrinsics/Arguments.vue';
import ExtrinsicMixin from '@/utils/mixins/extrinsicsMixin'
import Connector from '@vue-polkadot/vue-api';
import extractParams from '@/components/storage/extractParams'
import { getTypeDef } from '@polkadot/types';
import { TypeDef } from '@polkadot/types/types';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';


const components = {
  Selection,
  Executor,
  Argurments,
}

@Component({ components })
export default class Constants extends Mixins(ExtrinsicMixin) {

  public mounted(): void {
    const { api } = Connector.getInstance()
    this.setSection(api.rpc)
  }

  protected handleMethod(value: string) {
    const { fnSection } = this.getFnMethodAndSection();
    this.handleMethodSelection(value)

    const params: any[] = jsonrpc[fnSection][value].params;
    console.log('params',params);
  
    this.setArgs(params)
  }

  @Emit('click')
  public handleClick() {
    // TODO: send Map<> with name (key) and type (meta.type.asPlain)
    const { fnMethod, fnSection } = this.getFnMethodAndSection();
    const constantCodecPromise = this.getSection();
    const key = { name: `${fnSection}::${fnMethod}`, type: 'any' };
    
    return { key, method: this.getSection(), args: this.mapArgs() }
  }

    get disabled() {
    return this.hasArgs() && !this.mapArgs().filter(v => !!v).length 
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
