<template>
  <div>
    <NeoField :type="type" :message="error" :label="$t(label)">
      <NeoInput
        v-model="inputValue"
        :icon-right="iconRight"
        :placeholder="placeholder"
        :variant="variant"
        icon-right-clickable
        @icon-right-click="clearIconClick" />
    </NeoField>
  </div>
</template>

<script lang="ts" setup>
import correctFormat from '@/utils/ss58Format'
import { checkAddress, isAddress } from '@polkadot/util-crypto'
import { NeoField, NeoInput } from '@kodadot1/brick'

const emit = defineEmits(['input'])
const props = withDefaults(
  defineProps<{
    value: string
    label: string
    emptyOnError?: boolean
    strict: boolean
    icon?: string
    placeholder?: string
    disableError?: boolean
    isInvalid?: boolean
  }>(),
  {
    label: 'Insert Address',
    strict: true,
    icon: '',
    placeholder: '',
    emptyOnError: false,
  }
)

const { chainProperties } = useChain()
const error = ref<string | null>('')
const ss58Format = computed(() => chainProperties.value?.ss58Format)
const variant = computed(() => (props.isInvalid ? 'danger' : ''))
const type = computed(() => (error.value ? 'is-danger' : ''))
const iconRight = computed(() => {
  if (inputValue.value && props.icon === 'close-circle') {
    return 'close-circle'
  }
  return ''
})
const inputValue = computed({
  get: () => props.value,
  set: (value) => handleInput(value),
})

const clearIconClick = () => {
  inputValue.value = ''
  emit('input', '')
}

const handleInput = (value: string) => {
  emit('input', value)

  if (props.disableError) {
    return value
  }

  if (props.strict) {
    const [, err] = checkAddress(value, correctFormat(ss58Format.value))
    error.value = value ? err : ''
  } else {
    if (!props.emptyOnError && !value) {
      error.value = ''
    } else {
      error.value = isAddress(value) ? '' : 'Invalid address'
    }
  }

  return props.emptyOnError && error.value ? '' : value
}
</script>
