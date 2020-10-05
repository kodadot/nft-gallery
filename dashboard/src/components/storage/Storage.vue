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

    const params = extractParams(this.getSection() as StorageEntryPromise)
    console.log(params);
    
  
    this.setArgs(params.map(({type}, index) =>  ({ ...type, name: index })))
    console.log(this.mapArgs());
    
  }

  get disabled() {
    return this.hasArgs() && !this.mapArgs().filter(v => !!v).length 
  }

  @Emit('click')
  public handleClick() {
    const { fnMethod, fnSection } = this.getFnMethodAndSection();
    const storageEntryPromise: StorageEntryPromise = this.getSection() as StorageEntryPromise;
    const key: TypeDef = { ...getTypeDef(this.handleType(storageEntryPromise)), name: `${fnSection}::${fnMethod}` };
    
    return { key, method: this.getSection(), args: this.mapArgs() }
  }


  private handleType(storageEntryPromise: StorageEntryPromise): string {
    const { type } = storageEntryPromise.creator.meta;
    const { isPlain, isMap, isDoubleMap } = type;

    if (isPlain) {
      return type.asPlain.toString();
    }

    if (isMap) {
      return ''
      // return type.asMap.key.toString()
    }

    // TODO: not so correct
    if (isDoubleMap) {
      return ''
      // return type.asDoubleMap.key1.toString()
    }

    return ''
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
