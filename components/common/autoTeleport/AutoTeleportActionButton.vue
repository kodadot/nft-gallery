<template>
  <div class="is-flex is-flex-direction-column w-full">
    <div
      v-if="showAutoTeleport"
      class="is-flex is-justify-content-space-between w-full mb-4">
      <div class="is-flex">
        <div class="has-accent-blur">
          <img
            :src="`/auto-teleport-arrow${
              !isTelportIconActive ? '-disabled' : ''
            }.svg`"
            class="mr-2"
            alt="teleport arrow" />
          <img
            v-if="isTelportIconActive"
            src="/accent-blur.svg"
            alt="blur"
            class="blur" />
        </div>

        <p
          class="has-text-weight-bold"
          :class="{ 'has-text-k-grey': !hasAvailableTeleportTransition }">
          {{ $t('autoTeleport.autoTeleport') }}
        </p>

        <AutoTeleportTooltip
          v-if="hasAvailableTeleportTransition"
          position="top"
          :transition="optimalTransition" />
      </div>

      <div
        v-if="!hasAvailableTeleportTransition"
        class="is-flex is-align-items-center"
        :class="{ 'has-text-k-grey': !hasAvailableTeleportTransition }">
        <span class="is-size-7">{{ $t('autoTeleport.notAvailable') }}</span>

        <AutoTeleportTooltip position="left" :transition="optimalTransition" />
      </div>

      <NeoSwitch
        v-else
        v-model="autoTeleport"
        data-testid="auto-teleport-switch" />
    </div>

    <NeoButton
      :label="autoTeleportLabel"
      variant="k-accent"
      no-shadow
      :disabled="localDisabled"
      class="is-flex is-flex-grow-1 btn-height is-capitalized"
      @click="submit" />

    <div v-if="showAutoTeleport" class="is-flex is-justify-content-center mt-4">
      <span v-if="hasAvailableTeleportTransition" class="has-text-grey"
        >Or</span
      >

      <a class="ml-2" @click="onRampActive = true"
        >+ {{ $t('autoTeleport.addFundsViaOnramp') }}</a
      >
    </div>
  </div>

  <AutoTeleportModal
    v-model="isModalOpen"
    :transition="optimalTransition"
    :can-do-action="hasEnoughInCurrentChain"
    :transactions="transactions"
    @close="isModalOpen = false"
    @confirm="transaction"
    @telport:retry="teleport" />

  <AutoTeleportWelcomeModal
    :model-value="showFirstTimeTeleport"
    @close="preferencesStore.setFirstTimeAutoTeleport(false)" />

  <Loader
    v-if="!showAutoTeleport"
    :model-value="transactions.action.isLoading?.value"
    :status="transactions.action.status.value" />

  <OnRampModal v-model="onRampActive" @close="onRampActive = false" />
</template>

<script setup lang="ts">
import { NeoButton, NeoSwitch } from '@kodadot1/brick'
import { Actions } from '@/composables/transaction/types'
import OnRampModal from '@/components/shared/OnRampModal.vue'
import AutoTeleportWelcomeModal from './AutoTeleportWelcomeModal.vue'
import useAutoTeleport from '@/composables/autoTeleport/useAutoTeleport'
import Loader from '@/components/shared/Loader.vue'

const emit = defineEmits(['confirm', 'teleport:completed', 'action:completed'])
const props = withDefaults(
  defineProps<{
    amount: number
    label: string
    disabled: boolean
    action: Actions
  }>(),
  {
    disabled: false,
  },
)

const preferencesStore = usePreferencesStore()
const { $i18n } = useNuxtApp()
const { chainSymbol, name } = useChain()
const {
  isAvailable: isAutoTeleportAvailable,
  hasEnoughInCurrentChain,
  hasEnoughInRichestChain,
  optimalTransition,
  teleport,
  transactions,
  transaction,
} = useAutoTeleport(
  computed(() => props.action),
  computed(() => props.amount),
)

const isModalOpen = ref(false)
const onRampActive = ref(false)
const autoTeleport = ref(false)
const showFirstTimeTeleport = computed(
  () => preferencesStore.firstTimeAutoTeleport && autoTeleport.value,
)

const isTelportIconActive = computed(() => {
  if (!hasAvailableTeleportTransition.value) {
    return false
  }

  return autoTeleport.value
})

const hasAvailableTeleportTransition = computed(
  () => isAutoTeleportAvailable.value && optimalTransition.value.source,
)

const needsAutoTelport = computed(
  () => !hasEnoughInCurrentChain.value && hasEnoughInRichestChain.value,
)

const showAutoTeleport = computed(
  () => !hasEnoughInCurrentChain.value && isAutoTeleportAvailable.value,
)

const allowAutoTeleport = computed(
  () =>
    needsAutoTelport.value &&
    optimalTransition.value.source &&
    isAutoTeleportAvailable.value,
)

const autoTeleportLabel = computed(() => {
  if (!isAutoTeleportAvailable.value || hasEnoughInCurrentChain.value) {
    return props.label
  }

  if (allowAutoTeleport.value) {
    if (!autoTeleport.value) {
      return $i18n.t('autoTeleport.notEnoughTokenInChain', [
        chainSymbol.value,
        name.value,
      ])
    } else {
      return $i18n.t('autoTeleport.teleportAndConfirm')
    }
  }

  return $i18n.t('autoTeleport.insufficientFunds')
})

const localDisabled = computed(() => {
  if (!isAutoTeleportAvailable.value) {
    return props.disabled
  }

  if (hasEnoughInCurrentChain.value) {
    return false
  }

  if (hasEnoughInRichestChain.value) {
    return !autoTeleport.value
  }

  if (!hasEnoughInCurrentChain.value && !hasEnoughInRichestChain.value) {
    return true
  }

  return props.disabled
})

const openAutoTeleportModal = () => {
  isModalOpen.value = true

  teleport()
}

const submit = () => {
  emit('confirm')

  if (allowAutoTeleport.value) {
    openAutoTeleportModal()
  } else {
    transaction()
  }
}

type TeleportSteps = 'teleport' | 'action'
const steps: TeleportSteps[] = ['teleport', 'action']

watchEffect(() => {
  steps.forEach((step: TeleportSteps) => {
    const details = transactions.value[step]
    if (
      details.isLoading?.value === false &&
      details.status.value === TransactionStatus.Finalized
    ) {
      emit(`${step}:completed`)
    }
  })
})
</script>

<style lang="scss" scoped>
.btn-height {
  height: 3.5rem;
}
</style>
