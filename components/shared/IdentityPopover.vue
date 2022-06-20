<template>
  <v-tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    placement="bottom"
    :delay="[100, 800]">
    <template v-slot:trigger>
      <slot name="trigger" />
    </template>
    <div class="popover-content-container p-4 ms-dos-shadow">
      <div class="columns mb-3">
        <div class="column is-one-quarter">
          <Identicon
            :size="60"
            :theme="'polkadot'"
            :value="identity.address"
            class="popover-image avatar mr-5" />
        </div>
        <div class="column is-three-quarters">
          <p class="has-text-weight-bold is-size-5 mb-1 break-word">
            {{ identity.display }}
          </p>
          <a
            :href="`https://twitter.com/${identity.twitter}`"
            class="is-flex is-align-items-center mb-2"
            target="_blank"
            rel="noopener noreferrer"
            v-if="identity.twitter">
            <b-icon
              pack="fab"
              icon="twitter"
              class="is-flex is-justify-content-space-between" />
            <span>
              {{ identity.twitter | toString }}
            </span>
          </a>
          <p class="is-size-7 mb-1">
            {{ shortenedAddress }}
            <b-icon
              icon="copy"
              size="is-small"
              class="copy-icon"
              v-clipboard:copy="identity.address"
              @click.native="toast('Copied to clipboard')"></b-icon>
          </p>
          <p
            class="is-size-7 is-flex is-align-items-center py-3"
            v-if="totalCreated">
            <b-icon icon="clock" size="is-small" />
            <span class="ml-2">Started minting {{ formattedTimeToNow }}</span>
          </p>
          <p
            class="is-size-7 is-flex is-align-items-center py-3"
            v-if="formattedLastBoughtToNow">
            <b-icon icon="clock" size="is-small" />
            <span class="ml-2">Last bought {{ formattedLastBoughtToNow }}</span>
          </p>
        </div>
      </div>

      <hr style="height: 1px" class="m-0" />

      <div style="" class="popover-stats-container pt-3">
        <div class="has-text-centered">
          <p class="has-text-weight-bold is-size-6">{{ totalCollected }}</p>
          <span class="is-size-7 is-uppercase">{{
            $t('profile.collected')
          }}</span>
        </div>
        <div class="has-text-centered">
          <p class="has-text-weight-bold is-size-6">{{ totalCreated }}</p>
          <span class="is-size-7 is-uppercase">{{
            $t('profile.created')
          }}</span>
        </div>
        <div class="has-text-centered">
          <p class="has-text-weight-bold is-size-6">{{ totalSold }}</p>
          <span class="is-size-7 is-uppercase">{{ $t('profile.sold') }}</span>
        </div>
      </div>
    </div>
  </v-tippy>
</template>

<script lang="ts">
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import { notificationTypes, showNotification } from '@/utils/notification'
import { MintInfo } from '@/store/identityMint'
import shortAddress from '@/utils/shortAddress'
import Identicon from '@polkadot/vue-identicon'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import CreatedAtMixin from '@/utils/mixins/createdAtMixin'
import { isAfter, subHours } from 'date-fns'
import shouldUpdate from '@/utils/shouldUpdate'
import resolveQueryPath from '@/utils/queryPathResolver'
import { Interaction } from '@/components/rmrk/service/scheme'
import buyEventByProfile from '@/queries/rmrk/subsquid/buyEventByProfile.graphql'

type Address = string | undefined
type IdentityFields = Record<string, string>

@Component({
  components: {
    Identicon,
  },
})
export default class IdentityPopover extends mixins(
  PrefixMixin,
  CreatedAtMixin
) {
  @Prop() public identity!: IdentityFields

  protected totalCreated = 0
  protected totalCollected = 0
  protected totalSold = 0

  public async mounted() {
    const prefix = this.urlPrefix === 'rmrk' ? 'subsquid' : this.urlPrefix
    const query = await resolveQueryPath(prefix, 'buyEventByProfile')
    const { data } = await this.$apollo.query<{ events: Interaction[] }>({
      query: query.default,
      client: prefix,
      variables: {
        id: this.identity.address,
      },
    })
    if (data.events.length) {
      this.lastBoughtDate = new Date(data.events[0].timestamp)
    }
  }

  get shortenedAddress(): Address {
    return shortAddress(this.resolveAddress(this.identity.address))
  }

  private resolveAddress(account: Address): string {
    return account ? account.toString() : ''
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message)
  }

  @Watch('identity.address', { immediate: true })
  protected async onAddressChanged(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      await this.fetchNFTStats()
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
        await this.handleResult({ data, type: 'cache' })
      } else {
        const query = await resolveQueryPath(this.urlPrefix, 'nftStatsByIssuer')
        this.$apollo.addSmartQuery('collections', {
          query: query.default,
          manual: true,
          client: this.urlPrefix,
          loadingKey: 'isLoading',
          result: this.handleResult,
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

  protected async handleResult({
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
      this.totalCreated = data.nFTCreated.totalCount
      this.totalCollected = data.nFTCollected.totalCount
      this.totalSold = data.nFTSold.totalCount

      if (data?.firstMint?.nodes.length > 0) {
        this.firstMintDate = data.firstMint.nodes[0].collection.createdAt
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

.popover-image {
  min-width: 60px;
}

.popover-stats-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.copy-icon {
  cursor: pointer;
}

.break-word {
  overflow-wrap: break-word;
}

.ms-dos-shadow {
  box-shadow: $dropdown-content-shadow;
}
</style>
