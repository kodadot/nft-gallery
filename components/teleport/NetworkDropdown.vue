<template>
  <div class="w-full">
    <NeoDropdown class="w-full">
      <template #trigger="{ active }">
        <div class="is-flex is-flex-items-center">
          <NeoButton
            no-shadow
            expanded
            rounded
            class="black-border"
            :icon="active ? 'chevron-up' : 'chevron-down'">
            <div class="is-flex is-flex-items-center">
              <img
                class="mr-2"
                width="24"
                height="24"
                :src="selectedNetwork?.icon"
                alt="icon" />
              <span>{{ selectedNetwork?.label }}</span>
            </div>
          </NeoButton>
        </div>
      </template>
      <NeoDropdownItem
        v-for="opt in options"
        :key="opt.value"
        :active="value === opt.value"
        @click="emit('select', opt.value)">
        <div class="is-flex is-flex-items-center">
          <img class="mr-2" width="24" height="24" :src="opt.icon" alt="icon" />
          <span>{{ opt.label }}</span>
        </div>
      </NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { Chain } from '@/utils/teleport'

type NetworkOption = {
  label: string
  value: Chain
  disabled?: ComputedRef<boolean>
  icon: string
}
const props = defineProps<{
  options: NetworkOption[]
  value: string
}>()
const emit = defineEmits(['select'])

const selectedNetwork = computed<NetworkOption | undefined>(() => {
  return props.options.find((opt) => opt.value === props.value)
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.black-border {
  @include ktheme() {
    border: 1px solid theme('black');
  }
}
</style>
