<template>
  <div class="flex items-center gap-2">
    <ProfileButtonConfig
      v-if="buttonConfig"
      :class="mainClass"
      :loading="loading"
      :button="buttonConfig"
    />

    <template v-if="isTargetOfTrade && detailed && trade.type === TradeType.SWAP">
      <NeoTooltip
        position="top"
        content-class="capitalize"
        :label="$t('swap.counterSwap')"
      >
        <NeoButton
          variant="outlined-rounded"
          class="!p-0"
          @click="emit('click:counter-swap')"
        >
          <KIcon name="i-mdi:repeat" />
        </NeoButton>
      </NeoTooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoTooltip } from '@kodadot1/brick'
import type { ButtonConfig } from '../profile/types'
import { TradeType, type TradeNftItem } from '@/components/trade/types'

const emit = defineEmits(['click:main', 'click:counter-swap'])
const props = defineProps<{
  trade: TradeNftItem
  loading?: boolean
  disabled?: boolean
  label?: string
  mainClass?: string
  detailed?: boolean
}>()

const { accountId } = useAuth()
const { $i18n } = useNuxtApp()

const { isTargetOfTrade, isCreatorOfTrade } = useIsTrade(computed(() => props.trade), accountId)

const onClick = () => emit('click:main', props.trade)

const details = {
  [TradeType.SWAP]: {
    cancel: 'transaction.cancelSwap',
    accept: 'accept',
    withdraw: 'swap.withdrawSwap',
  },
  [TradeType.OFFER]: {
    cancel: 'transaction.cancelOffer',
    accept: 'accept',
    withdraw: 'offer.withdrawOffer',
  },
}

const tradeButtonConfig = computed<ButtonConfig | null>(() => {
  if (props.trade.isExpired) {
    return isCreatorOfTrade.value
      ? {
          label: $i18n.t(details[props.trade.type].withdraw),
          onClick,
        }
      : null
  }

  if (isCreatorOfTrade.value) {
    return {
      label: $i18n.t(details[props.trade.type].cancel),
      classes: '!border-k-red !bg-k-red-accent-2',
      onClick,
    }
  }

  if (isTargetOfTrade.value) {
    return {
      label: $i18n.t(details[props.trade.type].accept),
      onClick,
    }
  }

  return null
})

const buttonConfig = computed<ButtonConfig | null>(() => {
  if (!tradeButtonConfig.value) {
    return null
  }

  const config = { ...tradeButtonConfig.value }

  Object.assign(config, { disabled: props.disabled })

  props.label && Object.assign(config, { label: props.label })

  return config
})
</script>
