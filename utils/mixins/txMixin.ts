import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { Component, Vue } from 'nuxt-property-decorator';

/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* import { Component, Mixins } from 'nuxt-property-decorator';
* class ExtendedClass extends Mixins(ActualMixin) {
*/
@Component
export default class TransactionMixin extends Vue {
  public status = ''
  public isLoading = false;

  public resolveStatus(status: ExtrinsicStatus, omitFinalized?: boolean): void  {
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

  public initTransactionLoader(): void  {
    this.isLoading = true;
    this.status = 'loader.sign';
  }
}
