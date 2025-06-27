<template>
  <NeoModal
    :value="isModalActive"
    class="z-1000"
    @close="onClose"
  >
    <div class="sm:w-[40rem]">
      <header class="py-5 pl-6 pr-5 flex justify-between items-center">
        <span class="capitalize text-[1.6rem] font-bold">
          {{ $t('autoTeleport.welcomeToAutoTeleport') }}
        </span>

        <NeoButton
          class="py-1 px-2"
          variant="text"
          no-shadow
          icon="xmark"
          size="medium"
          @click="onClose"
        />
      </header>

      <div class="px-6 pt-4 pb-5">
        <div class="welcome-card-container">
          <div
            v-for="(x, index) in 3"
            :key="reasonsIcons[index]"
            class="border border-k-shade p-4"
          >
            <div class="has-accent-blur">
              <KIcon
                :name="reasonsIcons[index]"
                size="large"
                class="text-k-primary mb-3"
              />
              <img
                src="~/assets/svg/accent-blur.svg"
                class="blur-sm icon-blur"
                alt="blur-sm"
              >
            </div>

            <p class="font-bold text-xl mb-3">
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
            class="text-k-blue hover:text-k-blue-hover"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >{{ $t('helper.learnMore') }}</a>
        </div>

        <div class="flex justify-between mt-4">
          <NeoButton
            :label="$t('autoTeleport.welcome.submit')"
            variant="primary"
            no-shadow
            class="flex grow btn-height"
            @click="onClose"
          />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'

const emit = defineEmits(['close'])
const props = defineProps<{
  modelValue: boolean
}>()

const isModalActive = useVModel(props, 'modelValue')
const reasonsIcons = ['i-mdi:arrow-right-thick', 'i-mdi:timer-sand', 'i-mdi:sine-wave']

const onClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/mixins';

.btn-height {
  height: 3.5rem;
}

.welcome-card {
  &-container {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-gap: 1rem;

    @include bulma-mobile {
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
