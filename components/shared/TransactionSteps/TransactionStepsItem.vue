<template>
  <div class="is-flex">
    <div v-if="isChild" class="divider mr-6 ml-3" />

    <div
      class="mr-4"
      :class="{
        'is-flex is-align-items-center': isWaiting,
      }">
      <NeoIcon
        v-if="isLoading"
        icon="spinner-third"
        class="spinner"
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

    <div
      class="is-flex is-align-items-center"
      :class="{ 'w-full': showTryAgain }">
      <div
        class="is-flex is-flex-direction-column"
        :class="{ 'w-full': showTryAgain }">
        <p class="is-capitalized" :class="{ 'has-text-weight-bold': !isChild }">
          {{ step.title }}
        </p>
        <div class="is-flex is-justify-content-space-between">
          <p class="is-capitalized has-text-k-grey">{{ step.subtitle }}</p>

          <NeoButton
            v-if="showTryAgain"
            variant="pill"
            size="small"
            @click="tryAgain"
            >Try again</NeoButton
          >
        </div>
      </div>
      <div
        v-if="isCompleted && step.txId && isChild"
        class="is-flex-shrink-0 ml-4">
        <a
          v-safe-href="txUrl"
          class="has-text-link"
          target="_blank"
          rel="nofollow noopener noreferrer">
          View Tx
          <NeoIcon icon="arrow-up-right" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { TransactionStepStatus } from './utils'
import { type Prefix } from '@kodadot1/static'

export type TransactionStepItem = {
  txId: string | null
  isError: boolean
  status: TransactionStepStatus
  title: string
  subtitle?: string
  withAction?: boolean
  prefix?: Prefix
}

const emit = defineEmits(['tryAgain'])
const props = defineProps<{
  step: TransactionStepItem
  isChild?: boolean
  withAction?: boolean
}>()

const { getExtrinsicUrl } = useExplorer()
const txUrl = computed(() =>
  props.step.prefix
    ? getExtrinsicUrl(props.step.txId || '', props.step.prefix)
    : '',
)

const status = computed(() => props.step.status)
const iconSize = computed(() => (props.isChild ? 'medium' : 'large'))
const isLoading = computed(() => status.value === 'loading')
const isCompleted = computed(() => status.value === 'completed')
const isWaiting = computed(() => status.value === 'waiting')
const isFailed = computed(() => status.value === 'failed')
const showTryAgain = computed(() => isFailed.value && props.isChild)

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
