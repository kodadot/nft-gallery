<template>
  <div
    :id="PARAPORT_TARGET_ID"
    class="w-full"
  />

  <OnRampModal
    v-model="onRampActive"
    no-overlap
    @close="onRampActive = false"
  />

  <AutoTeleportWelcomeModal
    :model-value="showFirstTimeTeleport"
    @close="preferencesStore.setFirstTimeAutoTeleport(false)"
  />
</template>

<script setup lang="ts">
import { type NeoButtonVariant } from '@kodadot1/brick'
import AutoTeleportWelcomeModal from './AutoTeleportWelcomeModal.vue'
import { type ActionlessInteraction } from './utils'
import useAutoTeleportModal from '@/composables/autoTeleport/useAutoTeleportModal'
import type {
  AutoTeleportAction,
  AutoTeleportFeeParams,
} from '@/composables/autoTeleport/types'

export type AutoTeleportActionButtonConfirmEvent = {
  autoteleport: boolean
}

const PARAPORT_TARGET_ID = `paraport-${crypto.randomUUID()}`

const emit = defineEmits([
  'confirm',
  'teleport:completed',
  'actions:completed',
  'action:run',
  'modal:close',
])

const props = withDefaults(
  defineProps<{
    amount?: number | bigint
    label?: string
    disabled?: boolean
    actions?: AutoTeleportAction[]
    fees?: AutoTeleportFeeParams
    autoCloseModal?: boolean
    autoCloseModalDelayModal?: number
    interaction?: ActionlessInteraction
    hideTop?: boolean
    loading?: boolean
    shiny?: boolean
    earlySuccess?: boolean
    buttonVariant?: NeoButtonVariant
  }>(),
  {
    autoCloseModalDelayModal: undefined,
    disabled: false,
    amount: 0,
    autoCloseModal: false,
    actions: () => [],
    label: '',
    hideTop: false,
    loading: false,
    shiny: false,
    earlySuccess: true,
    buttonVariant: 'primary',
  },
)

const preferencesStore = usePreferencesStore()
const { isModalOpen } = useAutoTeleportModal()

const amounts = ref(0)

// const confirmButtonTitle = computed<string>(() => {
//   console.log('confirmButtonTitle', props.actions)
//   const interaction = props.interaction || props.actions[0]?.action?.interaction

//   return interaction ? getActionDetails(interaction).confirm : ''
// })

const { needed, isReady, available, txFees } = useParaport({
  amount: computed(() => amounts.value),
  fees: computed(() => props.fees),
  actions: computed(() => props.actions),
  label: computed(() => props.label),
  disabled: computed(() => props.disabled),
  targetId: PARAPORT_TARGET_ID,
  onAddFunds: () => {
    onRampActive.value = true
  },
  onAction: () => {
    emit('confirm', { autoteleport: false } as AutoTeleportActionButtonConfirmEvent)
  },
})

const onRampActive = ref(false)

const showFirstTimeTeleport = computed(
  () =>
    preferencesStore.firstTimeAutoTeleport
    && needed.value
    && !props.disabled,
)

watchSyncEffect(() => {
  if (!isModalOpen.value) {
    amounts.value = Number(props.amount)
  }
})

defineExpose({
  isReady,
  txFees,
  canAutoTeleport: available,
})
</script>
