import { Component, Vue } from 'nuxt-property-decorator'
import { useIdentityStore } from '@/stores/identity'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class AuthMixin extends Vue {
  get identityStore() {
    return useIdentityStore()
  }

  get accountId() {
    return this.identityStore.getAuthAddress
  }

  get isLogIn() {
    return Boolean(this.identityStore.getAuthAddress)
  }

  get balance(): string {
    return String(this.identityStore.auth.balance) || '0'
  }
}
