import { Registration } from '@polkadot/types/interfaces/identity/types';
import Vue from 'vue';

export default class IdentityMixin extends Vue {
  public async identityOf(address: string): Promise<Registration> {
    const identity = this.$store.getters.getIdentityFor(address);

    if (identity) {
      return Promise.resolve(identity);
    }

    return await this.$store
      .dispatch('fetchIdentity', address)
      .then(() => this.$store.getters.getIdentityFor(address))
      .then((id) => id || {});
  }
}
