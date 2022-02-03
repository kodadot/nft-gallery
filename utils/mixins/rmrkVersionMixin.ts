import { Component, Vue } from 'nuxt-property-decorator'
/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * usage import Component, { mixins } from 'vue-class-component';
 * class ExtendedClass extends mixins(SubscribeMixin) {
 */
@Component
export default class RmrkVersionMixin extends Vue {
  public version = '1.0.0'
}
