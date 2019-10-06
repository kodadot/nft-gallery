<template>
  <div>
    <b-tabs>
      <b-tab-item label="Extrinsic submission"></b-tab-item>
    </b-tabs>
    <Selection />
    <Executor />
  </div>
</template>

<script lang="ts">
import Selection from '../components/extrinsics/Selection.vue';
import Executor from '../components/extrinsics/Executor.vue';
import { Prop, Vue, Component } from 'vue-property-decorator';
import { VueConstructor } from 'vue';

@Component({
  components: {
    Selection,
    Executor,
  },
})
export default class Extrinsics extends Vue {
  private isValid: boolean = false;
  private isValidUnsigned: boolean = false;
  private method = null;
  private extrinsic = null;

  set extrinsicMethod(value: any) {
    this.extrinsic = value;
  }

  private getExtrinsic() {
    const { api } = (this as any).$http;
    const { method } = this;

    if (method) {
      const fn = api.findCall(method.callIndex);
      this.extrinsicMethod(api.tx[fn.section][fn.method](...method.args));
    }
  }
}
</script>
