import { Component, Vue } from 'vue-property-decorator';
/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* usage import Component, { mixins } from 'vue-class-component';
* class ExtendedClass extends mixins(SubscribeMixin) {
*/
@Component
export default class RmrkVersionMixin extends Vue {
  private _version = '1.0.0'

  get version() {
    return this._version
  }
}
