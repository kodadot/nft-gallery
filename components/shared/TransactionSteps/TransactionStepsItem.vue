<template>
  <div class="flex">
    <div class="mr-4 flex items-center">
      <KIcon
        v-if="isLoading"
        name="i-mdi:loading"
        class="spinner text-k-grey animate-spin"
        :size="iconSize"
      />

      <KIcon
        v-else-if="isCompleted"
        class="text-k-green"
        name="i-mdi:check-circle-outline"
        :size="iconSize"
      />

      <KIcon
        v-else-if="isWaiting"
        class="text-k-grey opacity-20"
        name="i-mdi:circle"
        :size="iconSize"
      />

      <KIcon
        v-else-if="isFailed"
        class="text-k-red"
        name="i-mdi:close"
        :size="iconSize"
      />
    </div>

    <div class="flex items-center">
      <div class="flex flex-col">
        <NeoTooltip
          v-if="step.tooltip"
          position="top"
          multiline
          class="max-w-fit"
        >
          <p class="capitalize font-bold">
            {{ step.title }}
            <KIcon
              name="i-mdi:information-slab-circle"
              class="ml-2 text-k-grey"
            />
          </p>

          <template #content>
            <span
              v-dompurify-html="step.tooltip"
              class="capitalize"
            />
          </template>
        </NeoTooltip>
        <p
          v-else
          class="capitalize font-bold"
        >
          {{ step.title }}
        </p>
        <div class="flex items-center">
          <p class="capitalize text-k-grey">
            {{ step.subtitle }}

            <span
              v-if="showDots"
              class="dots"
            />
          </p>

          <NeoButton
            v-if="showTryAgain"
            class="ml-4"
            variant="outlined-rounded"
            size="small"
            @click="tryAgain"
          >
            {{ $t('helper.tryAgain') }}
          </NeoButton>

          <a
            v-if="isCompleted && (step.txId || step.blockNumber)"
            v-safe-href="txUrl"
            class="text-k-blue hover:text-k-blue-hover ml-4 text-xs"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {{ $t('helper.viewTx') }}
            <KIcon name="i-mdi:arrow-top-right" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoTooltip } from '@kodadot1/brick'
import { type Prefix } from '@kodadot1/static'
import type { TransactionStepStatus } from './utils'

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
  withCustomSubtitle: boolean
}

const emit = defineEmits(['tryAgain'])
const props = defineProps<{
  step: TransactionStepItem
  withAction?: boolean
}>()

const { getTransactionUrl, getBlockUrl } = useExplorer()
const txUrl = computed(() => {
  if (!props.step.prefix) {
    return '#'
  }

  if (props.step.txId) {
    return getTransactionUrl(props.step.txId, props.step.prefix)
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

const showDots = computed(
  () => isLoading.value && !props.step.withCustomSubtitle,
)

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
