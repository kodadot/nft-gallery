<template>
  <div class="is-flex">
    <div class="mr-4 is-flex is-align-items-center">
      <NeoIcon
        v-if="isLoading"
        icon="spinner-third"
        class="spinner has-text-k-grey"
        :size="iconSize" />

      <NeoIcon
        v-else-if="isCompleted"
        class="has-text-k-green"
        icon="check"
        :size="iconSize" />

      <NeoIcon
        v-else-if="isWaiting"
        class="has-text-k-grey opacity-20"
        icon="circle"
        pack="fass"
        :size="iconSize" />

      <NeoIcon
        v-else-if="isFailed"
        class="has-text-k-red"
        icon="xmark"
        :size="iconSize" />
    </div>

    <div class="is-flex is-align-items-center">
      <div class="is-flex is-flex-direction-column">
        <NeoTooltip v-if="step.tooltip" position="top" multiline>
          <p
            class="is-capitalized has-text-weight-bold"
            :class="{ 'pr-8': isLoading }">
            {{ step.title }}
            <NeoIcon
              icon="fa-info-circle"
              pack="fa-regular"
              class="ml-2 has-text-k-grey" />
          </p>

          <template #content>
            <span v-dompurify-html="step.tooltip" />
          </template>
        </NeoTooltip>
        <p v-else class="is-capitalized has-text-weight-bold">
          {{ step.title }}
        </p>
        <div class="is-flex is-align-items-center">
          <p class="is-capitalized has-text-k-grey">
            {{ step.subtitle }}

            <span v-if="isLoading" class="dots" />
          </p>

          <NeoButton
            v-if="showTryAgain"
            class="ml-4"
            variant="pill"
            size="small"
            @click="tryAgain">
            {{ $t('helper.tryAgain') }}
          </NeoButton>

          <a
            v-if="isCompleted && (step.txId || step.blockNumber)"
            v-safe-href="txUrl"
            class="has-text-link ml-4 is-size-7"
            target="_blank"
            rel="nofollow noopener noreferrer">
            {{ $t('helper.viewTx') }}
            <NeoIcon icon="arrow-up-right" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoTooltip } from '@kodadot1/brick'
import { TransactionStepStatus } from './utils'
import { type Prefix } from '@kodadot1/static'

export type TransactionStepItem = {
  txId: string | null
  blockNumber: string | null
  isError: boolean
  status: TransactionStepStatus
  title: string
  subtitle?: string
  withAction?: boolean
  tooltip?: string
  isActive: boolean
  prefix?: Prefix
}

const emit = defineEmits(['tryAgain'])
const props = defineProps<{
  step: TransactionStepItem
  withAction?: boolean
}>()

const { getExtrinsicUrl, getBlockUrl } = useExplorer()
const txUrl = computed(() => {
  if (!props.step.prefix) {
    return '#'
  }

  if (props.step.txId) {
    return getExtrinsicUrl(props.step.txId, props.step.prefix)
  }

  if (props.step.blockNumber) {
    return getBlockUrl(props.step.blockNumber, props.step.prefix)
  }

  return '#'
})

const iconSize = 'large'
const status = computed(() => props.step.status)
const isLoading = computed(() => status.value === 'loading')
const isCompleted = computed(() => status.value === 'completed')
const isWaiting = computed(() => status.value === 'waiting')
const isFailed = computed(() => status.value === 'failed')
const showTryAgain = computed(() => isFailed.value)

const tryAgain = () => emit('tryAgain')
</script>

<style scoped lang="scss">
.divider {
  width: 1px;
  min-height: 100%;
  background-color: #cccccc;
}

.spinner {
  animation: spin 1s linear infinite;
}

.opacity-20 {
  opacity: 20%;
}
</style>
