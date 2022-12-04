<template>
  <b-dropdown
    class="navbar-chain"
    aria-role="list"
    :triggers="['click', 'hover']">
    <template #trigger>
      <div class="navbar-item" data-cy="create">
        {{ $t('create') }}
      </div>
    </template>
    <b-tooltip
      label="Start by creating your collection and add NFTs to it"
      position="is-right"
      style="display: block">
      <b-dropdown-item has-link data-cy="classic">
        <nuxt-link :to="`/${urlPrefix}/create`">
          {{ $t('classic') }}
        </nuxt-link>
      </b-dropdown-item>
    </b-tooltip>
    <template v-if="isRmrk">
      <b-tooltip
        label="Simplified process to create your NFT in a single step"
        position="is-right"
        style="display: block">
        <b-dropdown-item has-link data-cy="simple">
          <nuxt-link :to="`/${urlPrefix}/create/simple`">
            {{ $t('simple') }}
          </nuxt-link>
        </b-dropdown-item>
      </b-tooltip>
      <b-tooltip
        label="AI powered process to create your NFT"
        position="is-right"
        style="display: block">
        <b-dropdown-item has-link data-cy="creative">
          <nuxt-link :to="`/${urlPrefix}/create/creative`">
            {{ $t('creative') }}
          </nuxt-link>
        </b-dropdown-item>
      </b-tooltip>
    </template>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { getChainTestList } from '~/utils/constants'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import AuthMixin from '~~/utils/mixins/authMixin'
import { createVisible } from '~/utils/config/permision.config'

@Component({})
export default class NavbarCreate extends mixins(PrefixMixin, AuthMixin) {
  get options() {
    const availableUrlPrefixes = this.$store.getters['availableUrlPrefixes']

    if (!this.$config.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
      )
    }
    return availableUrlPrefixes
  }

  get isCreateVisible(): boolean {
    return createVisible(this.urlPrefix)
  }

  get isRmrk(): boolean {
    return this.urlPrefix === 'rmrk' || this.urlPrefix === 'westend'
  }
}
</script>
