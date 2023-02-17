<template>
  <b-field :label="$i18n.t(label)">
    <b-input
      ref="input"
      :value="value"
      :placeholder="placeholder"
      :expanded="expanded"
      :maxlength="maxlength"
      :required="required"
      :disabled="disabled"
      :type="type"
      :pattern="!value && required ? `^\\S+` : '.*'"
      @blur="hasFocus = false"
      @focus="hasFocus = true"
      @input="handleInput" />
    <template v-if="hasFocus && message" #message>
      <transition name="fade">
        <span class="has-text-primary is-italic">{{ message }}</span>
      </transition>
    </template>
  </b-field>
</template>

<script lang="ts" setup>
import type { BInput } from 'buefy/dist/components/input'

const { $i18n } = useNuxtApp()

withDefaults(
  defineProps<{
    value: string
    label: string
    placeholder: string
    expanded?: boolean
    message?: string
    maxlength?: string
    type?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    expanded: false,
    type: '',
    message: '',
    required: false,
    disabled: false,
    maxlength: undefined,
  }
)

const hasFocus = ref(false)
const emit = defineEmits(['input'])
const input = ref<BInput>(null)

function checkValidity() {
  return input.value?.checkHtml5Validity()
}

const handleInput = (value: string) => {
  console.log('input', value)
  emit('input', value.trim())
}

defineExpose({ checkValidity })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
