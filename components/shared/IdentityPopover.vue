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
            v-if="totalCollected && formattedLastBoughtToNow">
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
import PrefixMixin from '~/utils/mixins/prefixMixin'
import CreatedAtMixin from '~/utils/mixins/createdAtMixin'
import { isAfter, subHours } from 'date-fns'

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

  get shortenedAddress(): Address {
    return shortAddress(this.resolveAddress(this.identity.address))
  }

  private resolveAddress(account: Address): string {
    return account ? account.toString() : ''
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message)
  }

  public async mounted() {
    await this.fetchNFTStats()
  }

  @Watch('identity.address')
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
        const query =
          this.urlPrefix === 'rmrk'
            ? await import('@/queries/nftStatsByIssuer.graphql')
            : await import('@/queries/unique/nftStatsByIssuer.graphql')
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
      this.lastBoughtDate = data.lastBoughtDate
    } else if (data) {
      this.totalCreated = data.nFTCreated.totalCount
      this.totalCollected = data.nFTCollected.totalCount
      this.totalSold = data.nFTSold.totalCount

      if (data?.firstMint?.nodes.length > 0) {
        this.firstMintDate = data.firstMint.nodes[0].collection.createdAt
      }
      if (data?.nFTCollected?.nodes.length > 0) {
        this.lastBoughtDate = data.nFTCollected.nodes[0].collection.createdAt
      }
      const cacheData = {
        totalCreated: this.totalCreated,
        totalCollected: this.totalCollected,
        totalSold: this.totalSold,
        firstMintDate: this.firstMintDate,
        lastBoughtDate: this.lastBoughtDate,
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
