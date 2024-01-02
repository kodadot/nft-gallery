<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    @close="onClose">
    <div class="modal-width">
      <header class="py-5 pl-6 pr-5 flex justify-between items-center">
        <span class="capitalize is-size-3-5 has-text-weight-bold">
          {{ $t('autoTeleport.welcomeToAutoTeleport') }}
        </span>

        <NeoButton
          class="py-1 px-2"
          variant="text"
          no-shadow
          icon="xmark"
          size="medium"
          @click="onClose" />
      </header>

      <div class="px-6 pt-4 pb-5">
        <div class="welcome-card-container">
          <div
            v-for="(x, index) in 3"
            :key="reasonsIcons[index]"
            class="border border-k-shade p-4">
            <div class="has-accent-blur">
              <NeoIcon
                :icon="reasonsIcons[index]"
                size="large"
                class="has-text-k-primary mb-3" />
              <img src="/accent-blur.svg" class="blur icon-blur" alt="blur" />
            </div>

            <p class="has-text-weight-bold is-size-5 mb-3">
              {{ $t(`autoTeleport.welcome.${x}.title`) }}
            </p>

            <p class="text-k-grey">
              {{ $t(`autoTeleport.welcome.${x}.description`) }}
            </p>
          </div>
        </div>

        <p class="mt-4 capitalize">
          {{ $t('autoTeleport.welcome.description') }}
        </p>

        <div class="mt-2 is-hidden">
          <a
            class="has-text-link"
            target="_blank"
            rel="nofollow noopener noreferrer"
            >{{ $t('helper.learnMore') }}</a
          >
        </div>

        <div class="flex justify-between mt-4">
          <NeoButton
            :label="$t('autoTeleport.welcome.submit')"
            variant="k-accent"
            no-shadow
            class="flex flex-grow btn-height"
            @click="onClose" />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal } from '@kodadot1/brick'

const emit = defineEmits(['close'])
const props = defineProps<{
  modelValue: boolean
}>()

const isModalActive = useVModel(props, 'modelValue')
const reasonsIcons = ['arrow-right-to-arc', 'hourglass-half', 'wave-sine']

const onClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.top {
  z-index: 1000;
}

.modal-width {
  width: 40rem;

  @include mobile {
    width: unset;
  }
}

.btn-height {
  height: 3.5rem;
}

.welcome-card {
  &-container {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-gap: 1rem;

    @include mobile {
      grid-template-columns: repeat(1, auto);
    }
  }
}

.icon-blur {
  transform: scale(1.3);
  top: -9px !important;
  left: -8px !important;
}
</style>
