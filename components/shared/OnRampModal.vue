<template>
  <NeoModal v-model="isModalActive" scroll="clip" @close="onClose">
    <div class="modal-width">
      <div
        class="border-bottom border-grey is-flex is-align-items-center is-justify-content-space-between px-6">
        <p class="py-5 is-size-5 has-text-weight-bold">
          {{ $t('general.chooseProvider') }}
        </p>

        <NeoButton
          variant="text"
          no-shadow
          icon="xmark"
          icon-pack="fa-sharp"
          size="medium"
          class="cross"
          @click.native="onClose" />
      </div>
      <div class="px-6 py-2">
        <div
          v-for="provider in providers"
          :key="provider.value"
          class="provider is-flex is-justify-content-center py-4 is-align-items-start is-flex-direction-column"
          @click="onSelect(provider.value)">
          <div class="is-flex is-justify-content-center">
            <img
              :src="provider.image"
              class="provider-logo"
              :class="{
                'provider-logo__disabled': provider.disabled,
              }" />
            <p v-if="provider.disabled" class="ml-2 small-text has-text-grey">
              {{ $t('soon') }}
            </p>
          </div>

          <div
            class="mt-4 is-flex is-align-items-center is-justify-content-space-between w-full">
            <div class="small-text has-text-grey">
              {{ $t('general.supports') }}
            </div>

            <div class="small-text has-text-grey">
              {{ getSupportedTokensToText(provider.supports) }}
            </div>
          </div>

          <hr class="devider my-0 has-text-grey w-full mt-4" />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { showNotification } from '@/utils/notification'

enum Provider {
  TRANSAK = 'transak',
  PAYBIS = 'PAYBIS',
  RAMP = 'RAMP',
}

const emit = defineEmits(['close'])
const props = defineProps<{
  value: boolean
}>()

const { accountId } = useAuth()
const { $i18n } = useNuxtApp()

const isModalActive = useVModel(props, 'value')

const { init: initTransak } = useTransak()
const { isDarkMode } = useTheme()

const getImage = (service: string) => {
  return `/onramp-providers/${service}-logo${
    isDarkMode.value ? '-dark' : ''
  }.svg`
}

const getSupportedTokensToText = (tokens: string[]) =>
  tokens.map((token) => `$${token}`).join(', ')

const providers = computed(() => [
  {
    image: getImage('transak'),
    disabled: false,
    supports: ['DOT', 'KSM'],
    value: Provider.TRANSAK,
  },
  {
    image: getImage('ramp'),
    disabled: true,
    supports: ['DOT', 'KSM'],
    value: Provider.RAMP,
  },
  {
    image: getImage('paybis'),
    disabled: true,
    supports: ['DOT', 'KSM'],
    value: Provider.PAYBIS,
  },
])

const onClose = () => {
  console.log('closing')
  emit('close')
}

const onSelect = (provider: Provider) => {
  const selectedProvider = providers.value.find((p) => p.value === provider)

  if (selectedProvider?.disabled) {
    return
  }

  onClose()

  if (selectedProvider?.value === Provider.TRANSAK) {
    transakInit()
  }
}

const transakInit = () => {
  initTransak({
    address: accountId.value,
    onSuccess: () => {
      showNotification($i18n.t('general.successfullyAddedFunds'))
    },
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.small-text {
  font-size: 12px;
}

.provider-logo {
  width: 122px;

  &__disabled {
    opacity: 30%;
  }
}

.provider {
  cursor: pointer;

  .devider {
    @include ktheme() {
      border: 1px solid theme('k-shade');
    }
  }
}

.modal-width {
  width: 25rem;
}

@include touch() {
  .modal-width {
    width: unset;
  }
}
</style>
