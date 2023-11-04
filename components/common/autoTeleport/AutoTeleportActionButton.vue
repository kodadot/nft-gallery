<template>
  <div class="is-flex is-flex-direction-column w-full">
    <div
      v-if="showAutoTeleport"
      class="is-flex is-justify-content-space-between w-full mb-4">
      <div class="is-flex">
        <div class="has-accent-blur">
          <img :src="autoTeleportIcon" class="mr-2" alt="teleport arrow" />
          <img
            v-if="isTelportIconActive"
            src="/accent-blur.svg"
            alt="blur"
            class="blur autotelport-blur" />
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
      <span v-if="hasAvailableTeleportTransition" class="has-text-grey">{{
        $t('or')
      }}</span>

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
    @close="handleAutoTeleportModalClose"
    @telport:retry="teleport"
    @action:start="actionRun"
    @action:retry="actionRun" />

  <AutoTeleportWelcomeModal
    :model-value="showFirstTimeTeleport"
    @close="preferencesStore.setFirstTimeAutoTeleport(false)" />

  <OnRampModal v-model="onRampActive" @close="onRampActive = false" />
</template>

<script setup lang="ts">
import { NeoButton, NeoSwitch } from '@kodadot1/brick'
import OnRampModal from '@/components/shared/OnRampModal.vue'
import AutoTeleportWelcomeModal from './AutoTeleportWelcomeModal.vue'
import useAutoTeleport, {
  type AutoTeleportAction,
} from '@/composables/autoTeleport/useAutoTeleport'

export type AutoTeleportActionButtonConfirmEvent = {
  autoteleport: boolean
}

const emit = defineEmits([
  'confirm',
  'teleport:completed',
  'action:completed',
  'action:run',
])
const props = withDefaults(
  defineProps<{
    amount: number
    label: string
    disabled: boolean
    actions: AutoTeleportAction[]
    feeless?: boolean
  }>(),
  {
    feeless: false,
    disabled: false,
    amount: 0,
  },
)

const amount = ref(0)
const autoTeleportActions = ref<AutoTeleportAction[]>([])

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
} = useAutoTeleport(
  computed<AutoTeleportAction[]>(() => autoTeleportActions.value),
  computed(() => amount.value),
  props.feeless,
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

const autoTeleportIcon = computed(
  () =>
    `/auto-teleport-arrow${!isTelportIconActive.value ? '-disabled' : ''}.svg`,
)

const hasAvailableTeleportTransition = computed(
  () => isAutoTeleportAvailable.value && optimalTransition.value.source,
)

const needsAutoTelport = computed(
  () => !hasEnoughInCurrentChain.value && hasEnoughInRichestChain.value,
)

const canAutoTeleport = computed(
  () => optimalTransition.value.source && isAutoTeleportAvailable.value,
)

const showAutoTeleport = computed(
  () =>
    !hasEnoughInCurrentChain.value &&
    isAutoTeleportAvailable.value &&
    hasBalances.value &&
    !props.disabled,
)

const allowAutoTeleport = computed(
  () => needsAutoTelport.value && canAutoTeleport.value && hasBalances.value,
)

const hasNoFundsAtAll = computed(
  () => !hasEnoughInCurrentChain.value && !hasEnoughInRichestChain.value,
)

const autoTeleportLabel = computed(() => {
  if (hasEnoughInCurrentChain.value || props.disabled) {
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

const actionRun = async (interaction) => {
  const autoTeleportAction = autoTeleportActions.value.find(
    (action) => action.action.interaction === interaction,
  )

  if (!autoTeleportAction) {
    return
  }

  if (autoTeleportAction.transaction) {
    await autoTeleportAction.transaction(
      autoTeleportAction.action,
      autoTeleportAction.prefix || '',
    )
  } else if (autoTeleportAction.handler) {
    await autoTeleportAction.handler()
  }
}

const submit = () => {
  emit('confirm', {
    autoteleport: allowAutoTeleport.value && autoTeleport.value,
  } as AutoTeleportActionButtonConfirmEvent)

  if (allowAutoTeleport.value) {
    openAutoTeleportModal()
  }
}

const handleAutoTeleportModalClose = () => {
  isModalOpen.value = false
}

watch(allowAutoTeleport, (allow) => {
  if (allow) {
    autoTeleport.value = true
  }
})

watchSyncEffect(() => {
  if (!isModalOpen.value) {
    amount.value = props.amount
    autoTeleportActions.value = props.actions
  }
})
</script>

<style lang="scss" scoped>
.btn-height {
  height: 3.5rem;
}

.autotelport-blur {
  top: -3px !important;
  left: -4px !important;
  transform: scale(1.5);
}
</style>
