<template>
  <NeoModal
    v-model="isModalActive"
    :no-shadow="isMobile"
    :content-class="[
      'confirm-modal',
      isMobile ? 'only-top-border' : '',
      isExpanded ? 'mobile-modal-height' : '',
    ]"
    max-height="90vh"
    scroll="clip"
    @close="closeModal">
    <div
      :class="[
        'is-flex is-flex-direction-column is-justify-content-space-between',
        {
          'modal-width': !isMobile,
          'h-full pb-6': isMobile,
        },
      ]">
      <slot name="custom-header" />

      <header
        v-if="!$slots['custom-header']"
        class="py-5 px-6 is-flex is-justify-content-space-between border-bottom">
        <slot name="header" />

        <NeoButton
          variant="text"
          no-shadow
          icon="xmark"
          icon-pack="fa-sharp"
          @click.native="closeModal" />
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
import { useVModel } from '@vueuse/core'

const emit = defineEmits(['close', 'confirm'])

const props = defineProps<{
  value: boolean
  isMobile: boolean
  isExpanded?: boolean
}>()

const isModalActive = useVModel(props, 'value')

const closeModal = () => {
  emit('close')
}
</script>

<style lang="scss">
@import './NeoStickyModal.scss';
</style>
