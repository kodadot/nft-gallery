<template>
  <v-tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    placement="bottom"
    :delay="[100, 800]"
    data-cy="identity">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <div class="popover-content-container p-4 ms-dos-shadow">
      <IdentityPopoverHeader
        :identity="identity"
        :address="shortenedAddress"
        :started-minting="startedMinting"
        :last-bought="lastBought"
        :total-collected="totalCollected"
        :total-created="totalCreated" />
      <hr style="height: 1px" class="m-0" />
      <IdentityPopoverFooter
        :total-collected="totalCollected"
        :total-created="totalCreated"
        :total-sold="totalSold" />
    </div>
  </v-tippy>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { isAfter, subHours } from 'date-fns'
import Identicon from '@polkadot/vue-identicon'

import { MintInfo } from '@/store/identityMint'

import { notificationTypes, showNotification } from '@/utils/notification'
import { formatToNow } from '@/utils/format/time'
import resolveQueryPath from '@/utils/queryPathResolver'
import shortAddress from '@/utils/shortAddress'

import { Interaction } from '@/components/rmrk/service/scheme'

import CreatedAtMixin from '@/utils/mixins/createdAtMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

type Address = string | undefined
type IdentityFields = Record<string, string>

@Component({
  components: {
    Identicon,
    IdentityPopoverHeader: () =>
      import('@/components/shared/identity/popover/IdentityPopoverHeader.vue'),
    IdentityPopoverFooter: () =>
      import('@/components/shared/identity/popover/IdentityPopoverFooter.vue'),
  },
})
export default class IdentityPopover extends mixins(
  PrefixMixin,
  CreatedAtMixin
) {
  @Prop() public identity!: IdentityFields

  public totalCreated = 0
  public totalCollected = 0
  public totalSold = 0
  public firstMintDate = new Date()
  public lastBoughtDate = new Date()

  get address(): string {
    return this.identity.address
  }

  get shortenedAddress(): Address {
    return shortAddress(this.identity.address || '')
  }

  get startedMinting(): string {
    return formatToNow(this.firstMintDate)
  }

  get lastBought(): string {
    return formatToNow(this.lastBoughtDate)
  }

  public async mounted() {
    if (this.address) {
      this.fetchLastBought()
    }
  }

  private async fetchLastBought() {
    const query = await resolveQueryPath(this.client, 'buyEventByProfile')
    const { data } = await this.$apollo.query<{ events: Interaction[] }>({
      query: query.default,
      client: this.client,
      variables: {
        id: this.identity.address,
      },
    })

    if (data.events.length) {
      this.lastBoughtDate = new Date(data.events[0].timestamp)
    }
  }

  protected async fetchNFTStats() {
    try {
      const data = this.$store.getters['identityMint/getIdentityMintFor'](
        this.identity.address
      )
      if (
        data?.updatedAt &&
        isAfter(data.updatedAt, subHours(Date.now(), 12))
      ) {
        // if cache exist and within 12h
        await this.handleNFTStats({ data, type: 'cache' })
      } else {
        const query = await resolveQueryPath(this.client, 'userStatsByAccount')

        this.$apollo.addSmartQuery('collections', {
          query: query.default,
          manual: true,
          client: this.client,
          loadingKey: 'isLoading',
          result: this.handleNFTStats,
          variables: {
            account: this.identity.address || '',
          },
          fetchPolicy: 'cache-and-network',
        })
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger)
      this.$consola.warn(e)
    }
  }

  protected async handleNFTStats({
    data,
    type,
  }: {
    data: MintInfo | any
    type?: 'cache'
  }) {
    if (type === 'cache') {
      this.totalCreated = data.totalCreated
      this.totalCollected = data.totalCollected
      this.totalSold = data.totalSold
      this.firstMintDate = data.firstMintDate
    } else if (data) {
      this.totalCreated = data.created.totalCount
      this.totalCollected = data.collected.totalCount
      this.totalSold = data.sold.totalCount

      if (data.firstMint?.length > 0) {
        this.firstMintDate = data.firstMint[0].createdAt
      }

      const cacheData = {
        totalCreated: this.totalCreated,
        totalCollected: this.totalCollected,
        totalSold: this.totalSold,
        firstMintDate: this.firstMintDate,
        updatedAt: Date.now(),
      }
      await this.$store.dispatch('identityMint/setIdentity', {
        address: this.identity.address,
        cacheData,
      })
    }
  }

  @Watch('address', { immediate: true })
  protected async onAddressChanged() {
    if (this.address) {
      this.fetchLastBought()
      this.fetchNFTStats()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.tippy-container {
  display: inline-block;
}

.popover-content-container {
  border: 2px solid $primary;
  max-width: 350px;
}

.ms-dos-shadow {
  box-shadow: $dropdown-content-shadow;
}
</style>
