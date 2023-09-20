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
      <header
        class="is-flex is-justify-content-center is-align-items-center header px-6 py-3">
        <slot name="header" />

        <NeoButton
          class="position-right mr-6 py-1 px-2"
          variant="text"
          no-shadow
          icon="xmark"
          icon-pack="fa-sharp"
          size="medium"
          @click.native="closeModal" />
      </header>

      <div>
        <div
          :class="[
            { 'is-bordered-top scroll-height': isExpanded },
            'px-6 is-scrollable',
          ]">
          <slot name="body" />
        </div>
      </div>

      <div
        :class="[
          'is-flex is-flex-direction-column px-6 py-5 is-bordered-top',
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
import { NeoButton, NeoModal } from '@kodadot1/brick'

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
@import '@/styles/abstracts/variables';

.confirm-modal {
  @include mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0.75rem 0.75rem 0 0;

    &.mobile-modal-height {
      height: 90vh;
    }
  }

  &.only-top-border {
    border-right: 0 !important;
    border-left: 0 !important;
    border-bottom: 0 !important;
  }

  .scroll-height {
    height: 50vh;

    @include mobile {
      height: 60vh;
    }
  }

  .modal-width {
    width: 28rem;
  }

  .header {
    position: relative;
  }

  .position-right {
    position: absolute;
    right: 0;
  }

  .fixed-height {
    height: 10rem;
  }

  .fixed-button-height {
    min-height: 55px;
  }

  .is-scrollable {
    overflow-y: auto;
  }

  .is-bordered-top {
    @include ktheme() {
      border-top: 1px solid theme('k-shade');
    }
  }
}
</style>
<style lang="scss">
// manually calculated number, based on address length and container padding, not the best solution but it works :)
.o-tip__content.transfer-tooltip {
  transform: translateX(-22rem);

  .o-tip__arrow {
    transform: translateX(10rem);
  }
}
</style>
