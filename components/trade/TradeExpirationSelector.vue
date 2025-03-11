<template>
  <NeoDropdown
    v-model="selected"
    aria-role="list"
    :triggers="['click']"
    :position="position"
    append-to-body
    close-menu-on-move
    class="w-full"
    :menu-class="`!min-w-[8rem] !mt-0 ${customMenuClass}`"
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

          <KIcon
            name="i-mdi:chevron-down"
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
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'

const EXPIRATION_DAYS_LIST = [1, 3, 7, 14, 30]

const options = EXPIRATION_DAYS_LIST.map(value => ({
  value,
  text: `${value} Day${value > 1 ? 's' : ''}`,
}))

const selectedItem = computed(() => options.find(option => option.value === selected.value))

const props = withDefaults(
  defineProps<{
    modelValue?: number
    position?: string
    customMenuClass?: string
  }>(), {
    position: 'bottom-left',
  },
)

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
