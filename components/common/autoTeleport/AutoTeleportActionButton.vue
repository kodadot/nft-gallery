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
      :disabled="isDisabled"
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
    @telport:retry="teleport"
    @action:retry="transaction" />

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

const amount = ref(0)
const action = ref<Actions>(emptyObject<Actions>())

const preferencesStore = usePreferencesStore()
const { $i18n } = useNuxtApp()
const { chainSymbol, name } = useChain()
const {
  isAvailable: isAutoTeleportAvailable,
  hasBalances,
  hasEnoughInCurrentChain,
  hasEnoughInRichestChain,
  optimalTransition,
  transactions,
  teleport,
  transaction,
} = useAutoTeleport(
  computed<Actions>(() => action.value),
  computed(() => amount.value),
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
  () =>
    !hasEnoughInCurrentChain.value &&
    isAutoTeleportAvailable.value &&
    hasBalances.value,
)

const allowAutoTeleport = computed(
  () =>
    needsAutoTelport.value &&
    optimalTransition.value.source &&
    isAutoTeleportAvailable.value,
)

const hasNoFundsAtAll = computed(
  () => !hasEnoughInCurrentChain.value && !hasEnoughInRichestChain.value,
)

const autoTeleportLabel = computed(() => {
  if (hasEnoughInCurrentChain.value) {
    return props.label
  }

  if (!hasBalances.value) {
    return $i18n.t('autoTeleport.checking')
  }

  if (hasNoFundsAtAll.value) {
    return $i18n.t('autoTeleport.insufficientFunds')
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

  return $i18n.t('autoTeleport.checking')
})

const isDisabled = computed(() => {
  if (props.disabled || hasNoFundsAtAll.value) {
    return true
  }

  if (hasEnoughInCurrentChain.value) {
    return false
  }

  if (needsAutoTelport.value) {
    return !autoTeleport.value
  }

  return true
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

watchSyncEffect(() => {
  if (!isModalOpen.value) {
    amount.value = props.amount
    action.value = props.action
  }
})

type TeleportTransactions = 'teleport' | 'action'
const transactionEmits: TeleportTransactions[] = ['teleport', 'action']

watchEffect(() => {
  transactionEmits.forEach((transaction: TeleportTransactions) => {
    const details = transactions.value[transaction]
    if (
      details.isLoading?.value === false &&
      details.status.value === TransactionStatus.Finalized
    ) {
      emit(`${transaction}:completed`)
    }
  })
})
</script>

<style lang="scss" scoped>
.btn-height {
  height: 3.5rem;
}
</style>
