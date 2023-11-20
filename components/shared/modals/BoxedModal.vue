<template>
  <div class="modal-width">
    <header
      class="px-6 is-flex is-justify-content-space-between border-bottom is-align-items-center"
      :class="{
        'py-5': !loading,
        'py-4': loading,
      }">
      <NeoSkeleton
        v-if="loading"
        rounded
        width="150"
        height="35"
        no-margin
        border-radius="4rem" />

      <transition name="fade">
        <span
          v-if="!loading"
          class="modal-card-title is-size-6 has-text-weight-bold">
          {{ title }}
        </span>
      </transition>

      <NeoButton
        variant="text"
        no-shadow
        icon="xmark"
        size="medium"
        @click="onClose" />
    </header>

    <div
      class="px-6 py-4 is-relative"
      :class="{
        'limit-height': scrollable,
        'limit-height__loading': scrollable && loading,
      }">
      <div v-if="loading" class="skeleton-container">
        <NeoSkeleton
          class="skeleton-backdrop"
          rounded
          border-radius="20px"
          background-color="k-grey-light"
          no-margin
          full-size></NeoSkeleton>

        <div class="skeleton-content is-flex">
          <NeoIcon
            icon="spinner-third"
            class="spinner has-text-k-grey mr-6"
            size="large"
            spin></NeoIcon>

          <div>
            <p class="is-capitalized has-text-weight-bold is-size-6">
              {{ $t('general.doingSomeMagic') }}
            </p>
            <p class="is-capitalized is-size-6 has-text-k-grey">
              {{ $t('general.pleaseWait') }}
              <span class="dots" />
            </p>
          </div>
        </div>
      </div>

      <div
        ref="slot"
        class="slot"
        :class="{
          slot__loading: loading,
        }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoSkeleton } from '@kodadot1/brick'

const emits = defineEmits(['close'])
withDefaults(
  defineProps<{
    title: string
    loading?: boolean
    modalWidth?: string
    modalHeight?: string
    scrollable?: boolean
  }>(),
  {
    modalWidth: '25rem',
    modalHeight: '50vh',
    scrollable: true,
  },
)

const onClose = () => emits('close')
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

$x-padding: 2rem;
$t-padding: 1.5rem;
$b-padding: 1.25rem;

.modal-width {
  min-width: v-bind(modalWidth);
}

.limit-height {
  max-height: v-bind(modalHeight);
  overflow-y: auto;

  &__loading {
    overflow: hidden;
  }
}

.skeleton {
  &-backdrop {
    top: $t-padding;
    left: $x-padding;
    width: calc(100% - $x-padding * 2);
    height: calc(100% - ($t-padding + $b-padding));
    max-height: v-bind(modalHeight) !important;
    z-index: 2;
  }

  &-content {
    display: flex;
    justify-content: center;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }
}

.slot {
  &__loading {
    opacity: 0;
    z-index: 1;
  }
}
</style>
