<template>
<!-- <div> -->
  <component
    :is="is"
    v-if="((showTwitter && twitter) || !showTwitter) && ((showDiscord && discord) || !showDiscord)"
    v-clipboard:copy="address"
    :class="{ aligned: verticalAlign, overflowWrap: noOwerflow }"
  >
    <template v-if="(showTwitter && twitter) || (showDiscord && discord)">
      <a
        :href="`https://twitter.com/${twitter}`"
        class="twitter-link"
        target="_blank"
        rel="noopener noreferrer"
        v-if="showTwitter && twitter"
      >
        <b-icon pack="fab" icon="twitter" />
        <span class="aligned">
          {{ twitter | toString }}
        </span>
      </a>

      <div v-if="showDiscord && discord" class="is-flex is-align-items-center">
        <b-icon pack="fab" icon="discord" />
        <span class="aligned ml-2">
          {{ discord | toString }}
        </span>
      </div>
    </template>
    <template v-else>
      <span v-if="showOnchainIdentity" class="is-inline-flex is-align-items-center">
        {{ shortenedAddress | toString }}
        <img v-if="isFetchingIdentity" src="/infinity.svg" class="ml-1 infinity-loader">
        <template v-else>
          <span v-if="identity.display" class="ml-1">({{ identity.display }})</span>
        </template>
      </span>
      <span v-else>
        <IdentityPopover :identity="{ ...identity, address }">
          <template #trigger>
            {{ name | toString }}
          </template>
        </IdentityPopover>
      </span>
    </template>
  </component>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins, Emit } from 'nuxt-property-decorator'
import Connector from '@vue-polkadot/vue-api'
import InlineMixin from '@/utils/mixins/inlineMixin'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { hexToString, isHex } from '@polkadot/util'
import { emptyObject } from '@/utils/empty'
import { Data } from '@polkadot/types'
import shortAddress from '@/utils/shortAddress'
import { get, update } from 'idb-keyval'
import { identityStore } from '@/utils/idbStore'
import shouldUpdate from '@/utils/shouldUpdate'

type Address = string | GenericAccountId | undefined;
type IdentityFields = Record<string, string>;

const components = {
  IdentityPopover: () => import('@/components/shared/IdentityPopover.vue'),
}

@Component({ components })
export default class Identity extends mixins(InlineMixin) {
  @Prop() public address!: Address
  @Prop(Boolean) public verticalAlign!: boolean
  @Prop(Boolean) public noOwerflow!: boolean
  @Prop(Boolean) public emit!: boolean
  @Prop(Boolean) public showTwitter!: boolean
  @Prop(Boolean) public showDiscord!: boolean
  @Prop(Boolean) public showOnchainIdentity!: boolean
  private identity: IdentityFields = emptyObject<IdentityFields>()
  private isFetchingIdentity = false

  get shortenedAddress(): Address {
    return shortAddress(this.resolveAddress(this.address))
  }

  get name(): Address {
    const name = this.identity.display
    return name as string || this.shortenedAddress
  }

  get twitter(): Address {
    const twitter = this.identity.twitter
    return twitter as string || ''
  }

  get discord(): Address {
    const discord = this.identity.discord
    return discord
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
    return account instanceof GenericAccountId ? account.toString() : account || ''
  }

  protected async fetchIdentity(address: string): Promise<IdentityFields> {
    this.isFetchingIdentity = true
    const { api } = Connector.getInstance()

    const optionIdentity = await api?.query.identity?.identityOf(address)
    const identity = optionIdentity?.unwrapOrDefault()

    if (!identity?.size) {
      this.isFetchingIdentity = false
      return emptyObject<IdentityFields>()
    }

    const final = Array.from(identity.info)
      .filter(([_, value]) => !Array.isArray(value) && !value.isEmpty)
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

<style scoped>
.aligned {
  vertical-align: middle;
  display: inline-block;
}

.twitter-link {
  line-height: 20px;
}

.twitter-link .icon {
  vertical-align: middle;
  margin: auto 0 auto 0;
}

.overflowWrap {
  overflow-wrap: break-word;
}

.infinity-loader {
  height: 20px
}
</style>
