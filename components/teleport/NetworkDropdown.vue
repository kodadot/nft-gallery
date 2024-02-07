<template>
  <div>
    <NeoDropdown class="w-full">
      <template #trigger="{ active }">
        <NeoButton
          no-shadow
          expanded
          rounded
          class="h-10 border border-border-color"
          :icon="active ? 'chevron-up' : 'chevron-down'"
          :active="active">
          <div class="flex items-center">
            <img
              class="mr-2"
              width="24"
              height="24"
              :src="selectedNetwork?.icon"
              alt="icon" />
            <span>{{ selectedNetwork?.label }}</span>
          </div>
        </NeoButton>
      </template>
      <NeoDropdownItem
        v-for="opt in validateOptions"
        :key="opt.value"
        :active="value === opt.value"
        @click="emit('select', opt.value)">
        <div class="flex items-center">
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
const validateOptions = computed(() => {
  return props.options.filter((opt) => !opt.disabled?.value)
})
</script>
