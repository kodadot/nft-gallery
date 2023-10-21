<template>
  <div class="is-flex is-flex-direction-column w-full">
    <div
      v-if="allowAutoTeleport"
      class="is-flex is-justify-content-space-between w-full mb-4">
      <div class="is-flex">
        <p class="has-text-weight-bold">
          {{ $t('autoTeleport.autoTeleport') }}

          <AutoTeleportTooltip :transition="optimalTransition" />
        </p>
      </div>

      <NeoSwitch v-model="autoTeleport" data-testid="auto-teleport-switch" />
    </div>

    <NeoButton
      :label="autoTeleportLabel"
      variant="k-accent"
      no-shadow
      :disabled="localDisabled"
      class="is-flex is-flex-grow-1 btn-height"
      @click="submit" />

    <div
      v-if="allowAutoTeleport"
      class="is-flex is-justify-content-center mt-4">
      <span class="has-text-grey">Or</span>

      <a class="ml-2" @click="onRampActive = true"
        >+ {{ $t('autoTeleport.addFundsViaOnramp') }}</a
      >
    </div>
  </div>

  <AutoTeleportModal
    v-model="isModalOpen"
    :transition="optimalTransition"
    :can-do-action="hasEnoughInCurrentChain"
    :status="status"
    @close="isModalOpen = false"
    @confirm="transaction" />

  <OnRampModal v-model="onRampActive" @close="onRampActive = false" />
</template>

<script setup lang="ts">
import { NeoButton, NeoSwitch } from '@kodadot1/brick'
import { Actions } from '@/composables/transaction/types'
import OnRampModal from '@/components/shared/OnRampModal.vue'

const props = defineProps<{
  amount: number
  label: string
  action: Actions
}>()

const { $i18n } = useNuxtApp()
const { chainSymbol, name } = useChain()
const {
  canTeleport,
  hasEnoughInCurrentChain,
  hasEnoughInRichestChain,
  optimalTransition,
  teleport,
  status,
  transaction,
} = useAutoTeleport(
  props.action,
  computed(() => props.amount),
)

const isModalOpen = ref(false)
const onRampActive = ref(false)
const autoTeleport = ref(false)

const allowAutoTeleport = computed(
  () =>
    !hasEnoughInCurrentChain.value &&
    hasEnoughInRichestChain.value &&
    optimalTransition.value.source &&
    canTeleport.value,
)

const autoTeleportLabel = computed(() => {
  if (!canTeleport.value || hasEnoughInCurrentChain.value) {
    return props.label
  }

  if (hasEnoughInRichestChain.value && autoTeleport.value) {
    return $i18n.t('autoTeleport.teleportAndConfirm')
  }

  return $i18n.t('autoTeleport.notEnoughTokenInChain', [
    chainSymbol.value,
    name.value,
  ])
})

const localDisabled = computed(() => {
  if (
    hasEnoughInRichestChain.value &&
    canTeleport.value &&
    autoTeleport.value
  ) {
    return false
  }

  if (hasEnoughInCurrentChain.value) {
    return false
  }

  return true
})

const openAutoTeleportModal = () => {
  isModalOpen.value = true

  teleport({
    onError: () => {
      isModalOpen.value = false
    },
  })
}

const submit = () => {
  if (allowAutoTeleport.value) {
    openAutoTeleportModal()
  } else {
    transaction()
  }
}
</script>

<style lang="scss" scoped>
.btn-height {
  height: 3.5rem;
}
</style>
