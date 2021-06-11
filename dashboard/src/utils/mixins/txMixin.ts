import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { Component, Vue } from 'vue-property-decorator';

/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* import { Component, Mixins } from 'vue-property-decorator';
* class ExtendedClass extends Mixins(ActualMixin) {
*/
@Component
export default class TransactionMixin extends Vue {
  public status = ''
  public isLoading = false;

  public resolveStatus(status: ExtrinsicStatus, omitFinalized?: boolean) {
    if (status.isReady) {
      this.status = 'loader.casting';
      return;
    }

    if (status.isInBlock) {
      this.status = 'loader.block';
      return;
    }

    if (status.isFinalized) {
      this.status = omitFinalized ? '' : 'loading.finalized';
      return;
    }

    this.status = '';
  }
}
