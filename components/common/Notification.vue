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
    <div class="flex gap-2" :class="{ 'flex-col': variant !== 'success' }">
      <p class="text-k-grey text-sm break-all">{{ message }}</p>

      <a
        v-if="action"
        v-safe-href="action.url"
        :class="[
          variant === 'success'
            ? '!text-k-blue hover:!text-k-blue-hover !no-underline text-sm'
            : '!text-text-color text-[16px] ',
        ]"
        target="_blank">
        {{ action.label }}
        <NeoIcon :icon="action.icon" />
      </a>
    </div>
  </NeoMessage>
</template>

<script lang="ts" setup>
import { NeoIcon, NeoMessage, NeoMessageVariant } from '@kodadot1/brick'

type NotificationAction = { label: string; url: string; icon?: string }

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
    action?: MaybeRef<NotificationAction | undefined>
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
const action = computed(() => unref(props.action))
const variant = computed(() =>
  props.state
    ? NotificationStateToVariantMap[props.state.value]
    : props.variant,
)
const isLoadingState = computed(() => props.state?.value === 'loading')
</script>
