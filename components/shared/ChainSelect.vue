<template>
  <b-dropdown v-model="selected" aria-role="list">
    <template #trigger="{ active }">
      <b-button
        type="is-primary is-bordered navbar-link-background is-bordered-light"
        :label="selected"
        :icon-right="active ? 'caret-up' : 'caret-down'" />
    </template>
    <b-dropdown-item
      v-for="option in options"
      :key="option.value"
      aria-role="listitem"
      :value="option.value"
      :disabled="option.value === 'bsx'"
      :class="{ 'is-active': selected === option.value }"
      :data-cy="`chain-dropdown-${option.value}`">
      {{ option.text }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Option } from '@kodadot1/vuex-options/dist/types'
import {
  chainTestList,
  disableChainListOnProductionEnv,
} from '~/utils/constants'

@Component({})
export default class ChainSelect extends Vue {
  get options() {
    const availableUrlPrefixes: Option[] =
      this.$store.getters['availableUrlPrefixes']

    const hiddenChainList =
      window.location.hostname === 'kodadot.xyz'
        ? disableChainListOnProductionEnv
        : chainTestList
    if (!this.$config.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !hiddenChainList.includes(urlPrefix.value as string)
      )
    }
    return availableUrlPrefixes
  }

  get selected() {
    return this.$store.getters.getSettings['urlPrefix']
  }

  set selected(value) {
    this.$store.dispatch('setUrlPrefix', value)
    this.$router.push({ path: `/${value}` })
  }
}
</script>
