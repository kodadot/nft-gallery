<template>
  <div>
    <b-tabs>
      <b-tab-item label="Extrinsic submission"></b-tab-item>
    </b-tabs>
    <Selection />
    <div class="executor-wrapper">
      <Executor
        :methods="sections"
        @selected="handleSectionSelection"
        label="submit the following extrinsic"
      />
      <Executor :methods="methods" @selected="handleMethodSelection" label="method" />
    </div>
    <Argurments :args="args" />
    <div class="transaction buttons">
      <b-button type="is-danger" outlined disabled>Submit unsigned</b-button>
      <b-button type="is-primary">Submit Transaction</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Selection from "../components/extrinsics/Selection.vue";
import Executor from "../components/extrinsics/Executor.vue";
import Argurments from "../components/extrinsics/Arguments.vue";
import { Prop, Vue, Component } from "vue-property-decorator";

// import Connector from '@vue-polkadot/vue-api'
//
// const api = Connector.getInstance().api;
//
// if (api) {
//   const defaultSection = Object.keys(api.tx)[0];
// const defaultMethod = Object.keys(api.tx[defaultSection])[0];
// const apiDefaultTx = api.tx[defaultSection][defaultMethod];
// const apiDefaultTxSudo =
//         (api.tx.system && api.tx.system.setCode) || // 2.x
//         (api.tx.consensus && api.tx.consensus.setCode) || // 1.x
//         apiDefaultTx; // other
// }

@Component({
  components: {
    Selection,
    Executor,
    Argurments
  }
})
export default class Extrinsics extends Vue {
  private isValid: boolean = false;
  private isValidUnsigned: boolean = false;
  private method = null;
  private extrinsic = null;
  // private apiDefaultTxSudo = apiDefaultTxSudo;
  // private methods =
  private fnSection = "";
  private fnMethod = "";
  private args: any[] = [];

  get sections() {
    return Object.keys((this as any).$http.api.tx);
  }

  get methods() {
    return this.fnSection
      ? Object.keys((this as any).$http.api.tx[this.fnSection])
      : [];
  }

  public handleSectionSelection(value: string) {
    this.fnSection = value;
  }

  public handleMethodSelection(value: string) {
    this.fnMethod = value;
    this.args = (this as any).$http.api.tx[this.fnSection][value].meta.args;
  }

  private getExtrinsic() {
    const { api } = (this as any).$http;
    const { method } = this;

    if (method) {
      // @ts-ignore: Method has always value
      const fn = api.findCall(method.callIndex);
      // @ts-ignore: Method has always value
      this.extrinsic = api.tx[fn.section][fn.method](...method.args);
    }
  }
}
</script>

<style>
.executor-wrapper {
  display: flex;
}

.executor-wrapper > * {
  flex: 1;
}

.transaction.buttons {
  margin-top: 1em;
  float: right;
}
</style>
