<template>
  <div class="flex items-center gap-2">
    <ProfileButtonConfig
      v-if="buttonConfig"
      :class="mainClass"
      :loading="loading"
      :button="buttonConfig"
    />

    <template v-if="isTargetOfTrade && detailed && trade.type === TradeType.SWAP && !trade.isAnyTokenInCollectionDesired">
      <NeoTooltip
        position="top"
        content-class="capitalize"
        :label="$t('swap.counterSwap')"
      >
        <NeoButton
          variant="icon"
          @click="emit('click:counter-swap')"
        >
          <NeoIcon
            icon="swap"
          />
        </NeoButton>
      </NeoTooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoTooltip } from '@kodadot1/brick'
import type { ButtonConfig } from '../profile/types'
import { TradeType } from '@/components/trade/types'

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
    accept: 'transaction.acceptSwap',
    withdraw: 'swap.withdrawSwap',
  },
  [TradeType.OFFER]: {
    cancel: 'transaction.cancelOffer',
    accept: 'transaction.acceptOffer',
    withdraw: 'offer.withdrawOffer',
  },
}

const tradeButtonConfig = computed<ButtonConfig | null>(() => {
  if (props.trade.status === TradeStatus.EXPIRED) {
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
