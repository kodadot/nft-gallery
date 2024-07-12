<template>
  <NeoMessage
    :duration="duration"
    :title="title"
    :variant="variant"
    :icon="isLoadingState ? { icon: 'spinner-third', spin: true } : undefined"
    :hold-timer="isLoadingState"
    auto-close
    show-progress-bar
    @close="emit('close')">
    <div class="flex gap-2 flex-col">
      <p class="text-k-grey text-sm break-all">{{ message }}</p>

      <a
        v-if="action"
        v-safe-href="action.url"
        class="text-[16px] !text-text-color"
        target="_blank">
        {{ action.label }}
      </a>
    </div>
  </NeoMessage>
</template>

<script lang="ts" setup>
import { NeoMessage, NeoMessageVariant } from '@kodadot1/brick'

type NotificationAction = { label: string; url: string }

const NotificationStateToVariantMap: Record<
  LoadingNotificationState,
  NeoMessageVariant
> = {
  succeeded: 'success',
  loading: 'neutral',
  failed: 'danger',
}

const emit = defineEmits(['close'])
const props = withDefaults(
  defineProps<{
    title: MaybeRef<string>
    message: MaybeRef<string>
    duration?: number
    state?: Ref<LoadingNotificationState>
    variant?: NeoMessageVariant
    action?: NotificationAction
  }>(),
  {
    variant: 'success',
    duration: 10000,
    action: undefined,
    state: undefined,
  },
)

const title = computed(() => unref(props.title))
const message = computed(() => unref(props.message))
const variant = computed(() =>
  props.state
    ? NotificationStateToVariantMap[props.state.value]
    : props.variant,
)
const isLoadingState = computed(() => props.state?.value === 'loading')
</script>
