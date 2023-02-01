<template>
  <b-dropdown v-model="selected" aria-role="list" :triggers="['click']">
    <template #trigger>
      <div class="navbar-item" data-cy="chain">{{ chainName }}</div>
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
import { getChainNameByPrefix } from '~/utils/chain'

@Component({})
export default class ChainSelect extends Vue {
  get options() {
    const availableUrlPrefixes: Option[] =
      this.$store.getters['availableUrlPrefixes']

    if (!this.$config.public.dev) {
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

  get chainName() {
    return getChainNameByPrefix(this.selected)
  }
}
</script>
