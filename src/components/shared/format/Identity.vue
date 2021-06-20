<template>
  <component :is="is" v-clipboard:copy="address" :class="{ aligned: verticalAlign }">
    {{ name | toString }}
  </component>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import { Registration, IdentityInfo } from '@polkadot/types/interfaces/identity/types';
import InlineMixin from '@/utils/mixins/inlineMixin'
import { GenericAccountId } from '@polkadot/types/generic/AccountId';
import { hexToString, isHex } from '@polkadot/util';
import { emptyObject } from '@/utils/empty';
import { Data } from '@polkadot/types';
import { AnyJson } from '@polkadot/types/types';
import shortAddress from '@/utils/shortAddress';

type Address = string | GenericAccountId | undefined

const components = {}

@Component({ components })
export default class Identity extends Mixins(InlineMixin) {
  // @Prop({ default: false }) inline!: boolean;
  @Prop() public address!: Address;
  @Prop() public verticalAlign!: boolean;
  private identity: Registration = emptyObject<Registration>();

  get identityInfo(): IdentityInfo {
    return this.identity?.info
  }

  // get is() {
  //   return this.inline ? 'span' : 'div'
  // }

  get name(): Address {
    // console.log('get name -> identityInfo', this.identityInfo);
    const name = this.handleRaw(this.identityInfo?.display);
    // console.log('get name -> name', name);
    return name as string || this.address
  }

  get email(): Address {
    const email = this.handleRaw(this.identityInfo?.email);
    // console.log('Email', email);
    return email as string || 'email';
  }

  get web(): Address {
    const web = this.handleRaw(this.identityInfo?.web);
    // console.log('Email', web);
    return web as string || '';
  }

  get twitter(): Address {
    const twitter = this.handleRaw(this.identityInfo?.twitter);
    // console.log('Email', twitter);
    return twitter as string || 'twitter';
  }

  get riot(): Address {
    const riot = this.handleRaw(this.identityInfo?.riot);
    // console.log('Email', riot);
    return riot as string || '';
  }

  get legal(): Address{
    const legal = this.handleRaw(this.identityInfo?.legal);
    return legal as string || '';
  }
  // get image(): Address {
  //   const image = this.handleRaw(this.identityInfo?.image);
  //   // console.log('Email', image);
  //   return image || '';
  // }

  @Watch('address')
  async watchAddress(newAddress: Address,  oldAddress: Address) {
    console.log('@Watch(address)', newAddress);

    if ((newAddress && !oldAddress) || (oldAddress !== newAddress)) {
      this.identity = await this.identityOf(newAddress)
    }
  }


  public async created() {
    console.log('this.address', this.address);
    this.identity = await this.identityOf(this.address)
    ;
  }

  public async identityOf(account: Address): Promise<Registration> {
    if (!account) {
      return Promise.resolve(emptyObject<Registration>())
    }

    const address: string = account instanceof GenericAccountId ? account.toString() : account;
    const identity = this.$store.getters.getIdentityFor(address)

    if (identity) {
      return Promise.resolve(identity)
    }


   return await this.$store.dispatch('fetchIdentity', address)
    .then(() => this.$store.getters.getIdentityFor(address))
    .then(id => { console.log('identity', identity); return id || emptyObject<Registration>()  })
  }

  private handleRaw(display: Data): Address {
    if (display?.isRaw) {
      return display.asRaw.toHuman() as string;
    }

    if (isHex((display as any)?.Raw)) {
      return hexToString((display as any)?.Raw)
    }

    return shortAddress(this.resolveAddress(this.address))
  }

  private resolveAddress(account: Address): string {
    return account instanceof GenericAccountId ? account.toString() : account || '';
  }
}
</script>

<style scoped>
.aligned {
  vertical-align: middle;
  display: inline-block;
}
</style>
