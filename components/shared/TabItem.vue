<template>
  <p
    class="control"
    :class="{ 'full-width': fullWidth }"
  >
    <NeoButton
      class="explore-tabs-button"
      :tag="NuxtLink || tag"
      :no-shadow="noShadow"
      :active="active"
      :to="to"
    >
      <span> {{ text }}</span>
      <span
        v-if="count"
        class="ml-2 text-k-grey-fix"
      >{{
        formatNumber(count)
      }}</span>
      <NeoIcon
        v-if="icon"
        :icon="icon"
        class="ml-2"
      />
    </NeoButton>
  </p>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { resolveComponent } from 'vue'
import { formatNumber } from '@/utils/format/balance'

const NuxtLink = resolveComponent('NuxtLink')

const props = withDefaults(
  defineProps<{
    active: boolean
    text: string
    count?: number
    to?: string
    fullWidth?: boolean
    noShadow?: boolean
    tag?: string
    showActiveCheck?: boolean
  }>(),
  {
    to: '',
    showActiveCheck: true,
  },
)

const icon = computed(() =>
  props.showActiveCheck && props.active ? 'check' : '',
)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/mixins';

.control:not(:last-of-type) .explore-tabs-button {
  border-right: none;
}

.control,
.explore-tabs-button {
  width: 15rem;

  @include bulma-mobile {
    width: 100% !important;
  }

  @include bulma-until-widescreen {
    width: 12rem;
  }
}

.full-width {
  &.control,
  .explore-tabs-button {
    width: 100%;
  }
}
</style>
