
import { Component, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import shouldUpdate from '../shouldUpdate';

/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* import { Component, Mixins } from 'vue-property-decorator';
* class ExtendedClass extends Mixins(ActualMixin) {
*/
@Component
export default class AuthMixin extends Vue {
  private apiInstance = Connector.getInstance();
  private isApiReady = false;

  get api() {
    return this.apiInstance?.api;
  }

  get isApi() {
    return this.isApiReady;
  }

  @Watch('apiInstance.api')
  onApiChange(val: any, oldVal: any) {
    if (shouldUpdate(val, oldVal)) {
      console.log('api changed');
      val.isReady.then(() => {
        this.isApiReady = true;
      });
    }
  }



}
