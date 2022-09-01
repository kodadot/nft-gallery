import { Component, Vue } from 'nuxt-property-decorator'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class ExperimentMixin extends Vue {
  public searchParams = new URLSearchParams(window.location.search)

  get redesign() {
    return this.searchParams.get('redesign') === 'true'
  }
}
