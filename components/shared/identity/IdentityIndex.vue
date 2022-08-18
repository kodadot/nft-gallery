<template>
  <component
    :is="is"
    v-if="
      ((showTwitter && twitter) || !showTwitter) &&
      ((showDiscord && discord) || !showDiscord)
    "
    class="is-flex-wrap-wrap is-flex-grow-1">
    <IdentitySocial
      v-if="(showTwitter && twitter) || (showDiscord && discord)"
      :twitter="twitter"
      :show-twitter="showTwitter"
      :discord="discord"
      :show-discord="showDiscord" />
    <IdentityChain
      v-else
      :show-onchain-identity="showOnchainIdentity"
      :hide-identity-popover="hideIdentityPopover"
      :is-fetching-identity="isFetchingIdentity"
      :identity="identity"
      :address="address"
      :shortened-address="shortenedAddress"
      :name="name" />
  </component>
</template>

<script lang="ts">
import { Component, Emit, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { get, update } from 'idb-keyval'
import { hexToString, isHex } from '@polkadot/util'
import { Data } from '@polkadot/types'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { onApiConnect } from '@kodadot1/sub-api'

import InlineMixin from '@/utils/mixins/inlineMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'

import { emptyObject } from '@/utils/empty'
import { identityStore } from '@/utils/idbStore'
import shortAddress from '@/utils/shortAddress'
import shouldUpdate from '@/utils/shouldUpdate'

type Address = string | GenericAccountId | undefined
type IdentityFields = Record<string, string>

const components = {
  IdentitySocial: () =>
    import('@/components/shared/identity/IdentitySocial.vue'),
  IdentityChain: () => import('@/components/shared/identity/IdentityChain.vue'),
}

@Component({ components })
export default class Identity extends mixins(InlineMixin, UseApiMixin) {
  @Prop() public address!: Address
  @Prop(Boolean) public verticalAlign!: boolean
  @Prop(Boolean) public noOwerflow!: boolean
  @Prop(Boolean) public emit!: boolean
  @Prop(Boolean) public showTwitter!: boolean
  @Prop(Boolean) public showDiscord!: boolean
  @Prop(Boolean) public showOnchainIdentity!: boolean
  @Prop(Boolean) public hideIdentityPopover!: boolean
  @Prop(String) public customNameOption!: string
  public identity: IdentityFields = emptyObject<IdentityFields>()
  public isFetchingIdentity = false

  get shortenedAddress(): Address {
    return shortAddress(this.resolveAddress(this.address))
  }

  get name(): Address {
    if (this.customNameOption) {
      return this.customNameOption
    }
    const name = this.identity.display
    if (name?.length > 20) {
      return shortAddress(name)
    }
    return (name as string) || this.shortenedAddress
  }

  get twitter(): Address {
    const twitter = this.identity.twitter
    return (twitter as string) || ''
  }

  get discord(): Address {
    return this.identity?.discord
  }

  @Watch('address', { immediate: true })
  async watchAddress(newAddress: Address, oldAddress: Address) {
    if (shouldUpdate(newAddress, oldAddress)) {
      this.identityOf(newAddress).then((id) => (this.identity = id))
    }
  }

  protected mounted() {
    onApiConnect(this.apiUrl, async () => {
      this.identity = await this.identityOf(this.resolveAddress(this.address))
    })
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

    return identity
  }

  private handleRaw(display: Data): string {
    if (display?.isRaw) {
      return display.asRaw.toHuman() as string
    }

    if (isHex((display as any)?.Raw)) {
      return hexToString((display as any)?.Raw)
    }

    return display?.toString()
  }

  private resolveAddress(account: Address): string {
    return account instanceof GenericAccountId
      ? account.toString()
      : account || ''
  }

  protected async fetchIdentity(address: string): Promise<IdentityFields> {
    this.isFetchingIdentity = true
    const api = await this.useApi()

    const optionIdentity = await api?.query.identity?.identityOf(address)
    const identity = optionIdentity?.unwrapOrDefault()

    if (!identity?.size) {
      this.isFetchingIdentity = false
      return emptyObject<IdentityFields>()
    }

    const final = Array.from(identity.info)
      .filter(([, value]) => !Array.isArray(value) && !value.isEmpty)
      .reduce((acc, [key, value]) => {
        acc[key] = this.handleRaw(value as unknown as Data)
        return acc
      }, {} as IdentityFields)

    update(address, () => final, identityStore)
    this.isFetchingIdentity = false

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
