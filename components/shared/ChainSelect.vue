<template>
  <b-dropdown v-model="selected" aria-role="list">
    <template #trigger>
      <b-button
        type="is-primary is-bordered navbar-link-background is-bordered-light"
        :label="selected" />
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
