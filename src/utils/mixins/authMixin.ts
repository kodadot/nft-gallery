
import { Component, Vue } from 'vue-property-decorator'

/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* import { Component, Mixins } from 'vue-property-decorator';
* class ExtendedClass extends Mixins(ActualMixin) {
*/
@Component
export default class AuthMixin extends Vue {

  get accountId() {
    return this.$store.getters.getAuthAddress
  }
}
