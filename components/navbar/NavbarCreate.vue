<template>
  <b-dropdown aria-role="list" :triggers="['click', 'hover']">
    <template #trigger>
      <div class="navbar-item" data-cy="create">
        {{ $t('create') }}
      </div>
    </template>
    <b-dropdown-item has-link data-cy="classic">
      <b-tooltip
        position="is-left"
        label="Start by creating your collection and add NFTs to it"
        class="navbar-item-tooltip">
        <nuxt-link :to="`/${urlPrefix}/create`">
          {{ $t('classic') }}
        </nuxt-link>
      </b-tooltip>
    </b-dropdown-item>
    <template v-if="isRmrk">
      <b-dropdown-item has-link data-cy="simple">
        <b-tooltip
          position="is-left"
          label="Simplified process to create your NFT in a single step"
          class="navbar-item-tooltip">
          <nuxt-link :to="`/${urlPrefix}/mint`">
            {{ $t('simple') }}
          </nuxt-link>
        </b-tooltip>
      </b-dropdown-item>
      <b-dropdown-item has-link data-cy="creative">
        <b-tooltip
          position="is-left"
          label="AI powered process to create your NFT"
          class="navbar-item-tooltip">
          <nuxt-link :to="`/${urlPrefix}/creative`">
            {{ $t('creative') }}
          </nuxt-link>
        </b-tooltip>
      </b-dropdown-item>
    </template>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { getChainTestList } from '~/utils/constants'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import AuthMixin from '~~/utils/mixins/authMixin'

@Component({})
export default class NavbarCreate extends mixins(PrefixMixin, AuthMixin) {
  @Prop({ default: false }) isRmrk!: boolean
  get options() {
    const availableUrlPrefixes = this.$store.getters['availableUrlPrefixes']

    if (!this.$config.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
      )
    }
    return availableUrlPrefixes
  }
}
</script>
