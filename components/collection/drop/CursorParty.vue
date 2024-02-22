<template>
  <CursorParty
    :connections="connections"
    :ghost-on-elements="['generative-preview-card']"
    :label-formatter="labelFormatter" />
</template>

<script setup lang="ts">
import useCursorParty from '@/composables/party/useCursorParty'
import { DropEventType, UserDetails } from '@/composables/party/types'
import { formatAmountWithRound } from '@/utils/format/balance'
import { type CursorLabel } from '@/components/common/party/CursorParty.vue'

const DROP_MITED_EVENT_DURATION = 30000

const props = defineProps<{
  dropAlias: string
  userMintedCount: number
}>()

const { $i18n } = useNuxtApp()
const { chainSymbol, decimals } = useChain()
const { totalSpent, getUserStats } = useUserStats()
const { accountId } = useAuth()

const { connections } = useCursorParty({
  room: computed(() => props.dropAlias),
  spent: computed(() => (accountId.value ? totalSpent.value : undefined)),
})

const labelFormatter = (connection: UserDetails): CursorLabel => {
  const lastEvent = connection.lastEvent
  const hasSpent = connection.spent !== undefined

  if (lastEvent) {
    if (
      lastEvent.type === DropEventType.DROP_MINTED &&
      Date.now() - lastEvent.timestamp < DROP_MITED_EVENT_DURATION
    ) {
      return { image: lastEvent.image }
    }

    if (
      [DropEventType.DROP_GENERATING, DropEventType.DROP_MINTING].includes(
        lastEvent.type,
      ) &&
      !lastEvent.completed
    ) {
      return {
        label:
          lastEvent.type === DropEventType.DROP_GENERATING
            ? $i18n.t('mint.unlockable.generating')
            : $i18n.t('mint.unlockable.minting'),
        loading: lastEvent.type === DropEventType.DROP_MINTING,
      }
    }
  }

  if (hasSpent) {
    return {
      label: `${formatAmountWithRound(Number(connection.spent) || 0, decimals.value, chainSymbol.value === 'DOT' ? 0 : undefined)} ${chainSymbol.value}`,
    } as CursorLabel
  }
}

watch(() => props.userMintedCount, getUserStats)
</script>
