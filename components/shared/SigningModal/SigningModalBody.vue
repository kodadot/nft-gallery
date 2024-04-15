<template>
  <div>
    <ModalIdentityItem />
  </div>

  <slot>
    <div class="py-5 flex items-start">
      <NeoIcon icon="lightbulb" size="small" class="mr-2 !block" />
      <p v-dompurify-html="$t('autoTeleport.tip')" class="text-xs capitalize" />
    </div>
  </slot>

  <div class="h-[200px]">
    <SkeletonLoader
      :title="title"
      :subtitle="subtitle"
      :with-dots="showSubtitleDots"
      solid>
      <template v-if="failed">
        <NeoIcon class="text-k-red mr-6" icon="xmark" size="large" />

        <div>
          <p class="capitalize font-bold text-base">
            {{ title }}
          </p>
          <div class="flex items-center">
            <p class="capitalize text-base text-k-grey">
              {{ $t('transactionSteps.error') }}
            </p>

            <NeoButton
              class="ml-4"
              variant="outlined-rounded"
              size="small"
              @click="() => $emit('tryAgain')">
              {{ $t('helper.tryAgain') }}
            </NeoButton>
          </div>
        </div>
      </template>

      <template v-if="showEstimation" #footer>
        <SkeletonLoaderFooterPill
          :full-width="Boolean(customFormattedEstimation)">
          {{ formattedEstimation }}
        </SkeletonLoaderFooterPill>
      </template>
    </SkeletonLoader>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { TransactionStatus } from '@/composables/useTransactionStatus'

defineEmits(['tryAgain'])
const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    showSubtitleDots?: boolean
    failed?: boolean
    status?: TransactionStatus
    customFormattedEstimation?: string
  }>(),
  {
    showSubtitleDots: false,
    failed: false,
    customFormattedEstimation: undefined,
  },
)

const { formattedState, isTransactionInProgress } = useTransactionEstimatedTime(
  computed(() => props.status),
)

const showEstimation = computed(() =>
  props.customFormattedEstimation
    ? true
    : isTransactionInProgress.value && !props.failed,
)

const formattedEstimation = computed(
  () => props.customFormattedEstimation || formattedState.value,
)
</script>
