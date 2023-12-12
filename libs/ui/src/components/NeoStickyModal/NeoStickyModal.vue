<template>
  <NeoModal
    :value="modelValue"
    :content-class="['confirm-modal', isExpanded ? 'h-[90vh] md:h-auto' : '']"
    max-height="90vh"
    scroll="clip"
    @close="closeModal"
    @update:active="updateActive">
    <div class="flex flex-col justify-between pb-tw-8 md:w-[28rem] md:pb-0">
      <header
        :class="{
          'flex justify-center items-center relative px-6 py-3': !isBoxedHeader,
          'py-5 px-6 flex justify-between items-center border-b border-b-border-color':
            isBoxedHeader,
        }">
        <div
          :class="{
            'modal-card-title text-base font-bold': isBoxedHeader,
            'text-xl font-bold': !isBoxedHeader,
          }">
          <slot name="header" />
        </div>

        <NeoButton
          :class="{
            'absolute right-0 mr-6 py-1 px-2': !isBoxedHeader,
          }"
          variant="text"
          no-shadow
          icon="xmark"
          :size="isBoxedHeader ? undefined : 'medium'"
          @click="closeModal" />
      </header>

      <div>
        <div
          :class="[
            { 'border-t border-t-k-shade h-[60vh] md:h-[50vh]': isExpanded },
            'px-6 overflow-auto',
          ]">
          <slot name="body" />
        </div>
      </div>

      <div
        class="flex flex-col px-6 py-5 pb-tw-8 md:pb-0 border-t border-t-k-shade">
        <slot name="footer" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import NeoModal from '../NeoModal/NeoModal.vue'
import NeoButton from '../NeoButton/NeoButton.vue'

const { width } = useWindowSize()

const emit = defineEmits(['close', 'confirm', 'update:modelValue'])

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    isExpanded?: boolean
    withBoxedHeader?: boolean
  }>(),
  {
    withBoxedHeader: true,
  },
)

const updateActive = (value: boolean) => {
  emit('update:modelValue', value)
}

const isBoxedHeader = computed(() => width.value > 768 && props.withBoxedHeader)

const closeModal = () => {
  emit('close')
}
</script>

<style lang="scss">
@import './NeoStickyModal.scss';
</style>
