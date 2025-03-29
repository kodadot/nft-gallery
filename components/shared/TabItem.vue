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
      <KIcon
        v-if="icon"
        :name="icon"
        class="ml-2"
      />
    </NeoButton>
  </p>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
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
  props.showActiveCheck && props.active ? 'i-mdi:check' : '',
)
</script>

<style scoped lang="scss">
.control:not(:last-of-type) .explore-tabs-button {
  border-right: none;
}

.control,
.explore-tabs-button {
  width: 15rem;
  @apply bulma-until-widescreen:w-48 bulma-mobile:w-full;
}

.full-width {
  &.control,
  .explore-tabs-button {
    width: 100%;
  }
}
</style>
