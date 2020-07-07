<template>
  <div>
    <div class="executor-wrapper">
      <b-field label="Raw Value" label-position="inside">
            <b-input placeholder="0x" v-model="value" />
        </b-field>
      <b-button class="chainstate-button" type="is-dark" icon-left="plus" @click="handleClick" :disabled="disabled"  />
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
import { u8aToU8a } from '@polkadot/util';
import { Compact } from '@polkadot/types';
import { xxhashAsHex } from '@polkadot/util-crypto'


const components = {
  Selection,
  Executor,
  Argurments,
}

@Component({ components })
export default class Raw extends Mixins(ExtrinsicMixin) {
  private value: string = ''

  // api.rpc.state.subscribeStorage

  public mounted(): void {
    const { api } = Connector.getInstance()
    this.setSection(api.rpc)
    this.handleSectionSelection('state')
    this.handleMethodSelection('subscribeStorage')
  }
  

  get u8a() {
    return u8aToU8a(this.value)
  }

  get disabled() {
    return !this.u8a.length
  }

  @Emit('click')
  public handleClick() {
    // TODO: send Map<> with name (key) and type (meta.type.asPlain)
    // const { fnMethod, fnSection } = this.getFnMethodAndSection();
    // const constantCodecPromise: ConstantCodec = this.getSection() as ConstantCodec;
    const key: TypeDef = { type: 'Raw', name: this.value, info: 6 };
    const unwrap = (val: any[]) => val[0]
    console.log(this.u8a);
    
    return { key, method: this.getSection(), args: [[this.value]], unwrap: (val: any[]) => val[0], valueMethod: this.getFnSection().queryStorageAt  }
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
  height: 3.2em;
  margin-left: 0.3em;
}
</style>
