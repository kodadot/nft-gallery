<template>
	<div class="pt-2" v-if="twitter">
		<a :href="`https://twitter.com/${twitter}`" target="_blank" rel="noopener noreferrer">
			{{ twitter | toString }}
        <b-icon
          pack="fab"
          icon="twitter"
        >
        </b-icon>
		</a>
	</div>
</template>

<script lang="ts" >
import { Component, Prop, Watch, Mixins, Emit } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import InlineMixin from '@/utils/mixins/inlineMixin'
import { GenericAccountId } from '@polkadot/types/generic/AccountId';
import { hexToString, isHex } from '@polkadot/util';
import { emptyObject } from '@/utils/empty';
import { Data } from '@polkadot/types';
import shortAddress from '@/utils/shortAddress';
import { get, set, update } from 'idb-keyval';
import { identityStore } from '@/utils/idbStore'
import shouldUpdate from '@/utils/shouldUpdate';

type Address = string | GenericAccountId | undefined
type IdentityFields = Record<string, string>

const components = {}

@Component({ components })
export default class Identity extends Mixins(InlineMixin) {
  @Prop() public address!: Address;
  @Prop(Boolean) public verticalAlign!: boolean;
  @Prop(Boolean) public noOwerflow!: boolean;
  @Prop(Boolean) public emit!: boolean;
  private identity: IdentityFields = emptyObject<IdentityFields>();

  get twitter(): Address {
    // console.log('get twitter -> identityInfo', this.identityInfo);
    const twitter = this.identity.twitter
    return twitter as string || shortAddress(this.resolveAddress(this.address))
  }

  @Watch('address', { immediate: true })
  async watchAddress(newAddress: Address,  oldAddress: Address) {
    if (shouldUpdate(newAddress, oldAddress)) {
      this.identityOf(newAddress).then(id => this.identity = id)
    }
  }


  public async identityOf(account: Address): Promise<IdentityFields> {
    if (!account) {
      return Promise.resolve(emptyObject<IdentityFields>())
    }

    const address: string = this.resolveAddress(account)
    const identity = await get(address, identityStore)

    if (!identity) {
      return await this.fetchIdentity(address)
    }

    if (this.emit) {
      this.emitIdentityChange(identity)
    }

    return identity;
  }

  private handleRaw(display: Data): string {
    if (display?.isRaw) {
      return display.asRaw.toHuman() as string;
    }

    if (isHex((display as any)?.Raw)) {
      return hexToString((display as any)?.Raw)
    }

    return display?.toString();
  }

  private resolveAddress(account: Address): string {
    return account instanceof GenericAccountId ? account.toString() : account || '';
  }

  protected async fetchIdentity(address: string): Promise<IdentityFields> {
    const { api } = Connector.getInstance()

    const optionIdentity = await api?.query.identity?.identityOf(address)
    const identity = optionIdentity?.unwrapOrDefault()


    if (!identity.size) {
      console.warn('[IDENTITY] NO', address)
      return emptyObject<IdentityFields>();
    }


    const final = Array.from(identity.info)
    .filter(([_, value]) => !Array.isArray(value) && !value.isEmpty)
    .reduce((acc, [key, value]) => {
      acc[key] = this.handleRaw(value as Data)
      return acc;
    }, {} as IdentityFields)

    update(address, () => final, identityStore)

    if (this.emit) {
      this.emitIdentityChange(final)
    }

    return final
  }

  @Emit('change')
  emitIdentityChange(final: IdentityFields) {
    return final
  }
}
</script>

<style scoped>
.aligned {
	vertical-align: middle;
	display: inline-block;
}
</style>
