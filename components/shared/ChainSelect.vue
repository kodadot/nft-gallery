<template>
  <b-dropdown v-model="selected" aria-role="list">
    <template #trigger="{ active }">
      <b-button
        type="is-primary is-bordered"
        :label="selected"
        :icon-right="active ? 'caret-up' : 'caret-down'" />
    </template>
    <b-dropdown-item
      aria-role="listitem"
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :class="{ 'is-active': selected === option.value }"
      :disabled="option.value === 'bsx'">
      {{ option.text }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class ChainSelect extends Vue {
  get options() {
    return this.$store.getters['availableUrlPrefixes']
  }

  get selected() {
    return this.$store.getters.getSettings['urlPrefix']
  }

  set selected(value) {
    this.$store.dispatch('setUrlPrefix', value)
  }
}
</script>
