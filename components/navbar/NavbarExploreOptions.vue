<template>
  <div>
    <nuxt-link :to="`/${urlPrefix}/explore?tab=GALLERY`" class="menu-item mr-2">
      {{ $t('gallery') }}
    </nuxt-link>
    <nuxt-link
      :to="`/${urlPrefix}/explore?tab=COLLECTION`"
      class="menu-item mr-2">
      {{ $t('collections') }}
    </nuxt-link>
    <span class="menu-item is-disabled">
      {{ $t('users') }}
      <span class="small-size-text">
        {{ $t('soon') }}
      </span>
    </span>
    <hr aria-role="menuitem" class="dropdown-divider my-4" />
    <span
      v-for="option in options.slice(0, 3)"
      :key="option.value"
      :class="[
        'menu-item',
        'mr-2',
        { 'is-active': selectedChain === option.value },
      ]"
      :value="option.value"
      @click="setSelectedChain(option.value)">
      {{ option.text }}
    </span>
  </div>
</template>

<script lang="ts">
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { Component, mixins } from 'nuxt-property-decorator'
import { getChainTestList } from '~/utils/constants'

import AuthMixin from '~~/utils/mixins/authMixin'

@Component({})
export default class NavbarExploreOptions extends mixins(
  PrefixMixin,
  AuthMixin
) {
  get options() {
    const availableUrlPrefixes = this.$store.getters['availableUrlPrefixes']

    if (!this.$config.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
      )
    }
    return availableUrlPrefixes
  }

  get selectedChain() {
    return this.$store.getters.getSettings['urlPrefix']
  }

  setSelectedChain(value) {
    this.$store.dispatch('setUrlPrefix', value)
    this.$router.push({ path: `/${value}` })
  }
}
</script>
