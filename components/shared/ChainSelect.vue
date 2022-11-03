<template>
  <b-dropdown
    v-model="selected"
    class="navbar-chain"
    aria-role="list"
    :triggers="['click', 'hover']">
    <template #trigger>
      <div class="navbar-item" data-cy="explore">
        {{ selected }}
        <svg
          class="ml-1"
          width="14"
          height="7"
          viewBox="0 0 14 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.0002 1L7.00024 6L1.00025 0.999999"
            stroke="currentColor"
            stroke-width="1.26984" />
        </svg>
      </div>
    </template>
    <b-dropdown-item
      v-for="option in options"
      :key="option.value"
      aria-role="listitem"
      :value="option.value"
      :class="{ 'is-active': selected === option.value }"
      :data-cy="`chain-dropdown-${option.value}`">
      {{ option.text }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Option } from '@kodadot1/vuex-options/dist/types'
import { getChainTestList } from '~/utils/constants'

@Component({})
export default class ChainSelect extends Vue {
  get options() {
    const availableUrlPrefixes: Option[] =
      this.$store.getters['availableUrlPrefixes']

    if (!this.$config.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
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
