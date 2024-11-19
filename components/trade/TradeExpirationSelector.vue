<template>
  <NeoDropdown
    v-model="selected"
    aria-role="list"
    :triggers="['click']"
    position="bottom-left"
    append-to-body
    close-menu-on-move
    class="w-full"
    menu-class="!min-w-[8rem]"
  >
    <template #trigger="{ active }">
      <div
        class="flex items-center justify-between border border-k-grey px-4 py-2"
        :class="{
          '!border-black': active,
        }"
      >
        <span class="text-k-grey">{{ formattedExpirationTime }}</span>
        <div
          class="flex items-center gap-1 cursor-pointer"
        >
          {{ selectedItem?.text }}

          <NeoIcon
            icon="chevron-down"
          />
        </div>
      </div>
    </template>

    <NeoDropdownItem
      v-for="option in options"
      :key="option.value"
      class="text-center"
      aria-role="listitem"
      :value="option.value"
      :class="{ 'is-active': selected === option.value }"
    >
      {{ option.text }}
    </NeoDropdownItem>
  </NeoDropdown>
</template>

<script setup lang="ts">
import { NeoDropdown, NeoDropdownItem, NeoIcon } from '@kodadot1/brick'

const EXPIRATION_DAYS_LIST = [1, 3, 7, 14, 30]

const options = EXPIRATION_DAYS_LIST.map(value => ({
  value,
  text: `${value} Day${value > 1 ? 's' : ''}`,
}))

const selectedItem = computed(() => options.find(option => option.value === selected.value))

const props = defineProps<{
  modelValue?: number
}>()

const emit = defineEmits(['update:modelValue'])

const selected = useVModel(props, 'modelValue', emit, {
  defaultValue: 7,
})

const formattedExpirationTime = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + selected.value!)
  return date.toLocaleString(undefined, {
    month: 'numeric',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
})
</script>
