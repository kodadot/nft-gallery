<template>
  <div :id="id">
    <slot name="trigger" :handle-open="handleOpen">
      <NeoButton
        :icon-left="icon"
        :expanded="expanded"
        :class="{
          'modal-wrapper-button__right': isRight,
          'is-invisible': isButtonHidden,
          'is-squared': isSquared,
        }"
        :variant="variant"
        no-shadow
        @click="handleOpen">
        <template v-if="label">{{ label }}</template>
      </NeoButton>
    </slot>
    <NeoModal :value="isModalActive" @close="isModalActive = false">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            {{ label || title }}
          </p>
          <slot name="hint" />
        </header>
        <div class="card-content text-center">
          <slot></slot>
        </div>
      </div>
    </NeoModal>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoModal } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    label: string
    title: string
    icon: string
    type?: string
    expanded: boolean
    isRight: boolean
    id: string
    isButtonHidden: boolean
  }>(),
  {
    type: undefined,
    id: '',
    isButtonHidden: false,
  },
)

const isModalActive = ref(false)
const handleOpen = () => {
  isModalActive.value = true
}

const isSquared = computed(() => !props.label && props.icon && !props.expanded)
const variant = computed(() => (isSquared.value ? 'border-icon' : undefined))
</script>

<style scoped lang="scss">
.modal-wrapper-button__right {
  float: right;
}
.is-squared {
  width: 36px;
  height: 36px;
}
</style>
