<template>
  <NeoModal
    :value="modelValue"
    :no-shadow="isMobile"
    :content-class="[
      'confirm-modal',
      isMobile ? 'only-top-border' : '',
      isExpanded ? 'mobile-modal-height' : '',
    ]"
    max-height="90vh"
    scroll="clip"
    @close="closeModal"
    @update:active="updateActive">
    <div
      :class="[
        'is-flex is-flex-direction-column is-justify-content-space-between',
        {
          'modal-width': !isMobile,
          'h-full pb-6': isMobile,
        },
      ]">
      <header
        :class="{
          'is-flex is-justify-content-center is-align-items-center is-relative px-6 py-3':
            !isBoxedHeader,
          'py-5 px-6 is-flex is-justify-content-space-between border-bottom':
            isBoxedHeader,
        }">
        <div
          :class="{
            'modal-card-title is-size-6 has-text-weight-bold': isBoxedHeader,
            'is-size-5 has-text-weight-bold': !isBoxedHeader,
          }">
          <slot name="header" />
        </div>

        <NeoButton
          :class="{
            'position-right mr-6 py-1 px-2': !isBoxedHeader,
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
            { 'border-top-k-shade scroll-height': isExpanded },
            'px-6 is-scrollable',
          ]">
          <slot name="body" />
        </div>
      </div>

      <div
        :class="[
          'is-flex is-flex-direction-column px-6 py-5 border-top-k-shade',
          {
            'pb-6': isMobile,
          },
        ]">
        <slot name="footer" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import NeoModal from '../NeoModal/NeoModal.vue'
import NeoButton from '../NeoButton/NeoButton.vue'

const emit = defineEmits(['close', 'confirm', 'update:modelValue'])

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    isMobile: boolean
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

const isBoxedHeader = computed(() => !props.isMobile && props.withBoxedHeader)

const closeModal = () => {
  emit('close')
}
</script>

<style lang="scss">
@import './NeoStickyModal.scss';
</style>
