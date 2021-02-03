<template>
  <div v-clipboard:copy="address">
    {{ name | toString }}
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import { Registration, IdentityInfo } from '@polkadot/types/interfaces/identity/types';
import IdentityMixin from '@/utils/mixins/identityMixin'
import { GenericAccountId } from '@polkadot/types/generic/AccountId';
import { hexToString } from '@polkadot/util';

type Address = string | GenericAccountId | undefined

const components = {}

@Component({ components })
export default class Identity extends Vue {
  @Prop() public address!: Address;
  private identity: Registration = {} as Registration;

  get identityInfo(): IdentityInfo {
    return this.identity?.info
  }

  get name(): Address {
    console.log('name', this.identityInfo);
    const name = this.identityInfo?.display;
    return hexToString((name as any)?.Raw) || this.address
  }

  @Watch('address')
  async watchAddress(newAddress: Address,  oldAddress: Address) {
    console.log('@Watch(address)', newAddress);
    
    if ((newAddress && !oldAddress) || (oldAddress !== newAddress)) {
      this.identity = await this.identityOf(newAddress)
    } 
  }
  

  public async mounted() {
    console.log('this.address', this.address);
    this.identity = await this.identityOf(this.address)
    ;
  }

  public async identityOf(account: Address): Promise<Registration> {
    if (!account) {
      return Promise.resolve({} as Registration)
    }

    const address: string = account instanceof GenericAccountId ? account.toString() : account;
    const identity = this.$store.getters.getIdentityFor(address)

    if (identity) {
      return Promise.resolve(identity)
    }

  
   return await this.$store.dispatch('fetchIdentity', address)
    .then(() => this.$store.getters.getIdentityFor(address))
    .then(id => id || {})
  }
}
</script>
