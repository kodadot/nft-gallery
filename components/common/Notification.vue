<template>
  <NeoMessage
    :duration="duration"
    :title="title"
    :variant="variant"
    :icon="icon"
    :hold-timer="holdTimer"
    auto-close
    show-progress-bar
    @close="emit('close')"
  >
    <div
      class="flex gap-2"
      :class="{ 'flex-col': variant !== 'success' }"
    >
      <p class="text-k-grey text-sm break-all">
        {{ message }}
      </p>

      <a
        v-if="action"
        v-safe-href="action.url"
        :class="[
          variant === 'success'
            ? 'text-k-blue! hover:text-k-blue-hover! no-underline! text-sm'
            : 'text-text-color! text-[16px] ',
        ]"
        target="_blank"
      >
        {{ action.label }}
        <NeoIcon :icon="action.icon" />
      </a>
    </div>

    <template
      v-if="footer"
      #footer
    >
      <div
        class="flex items-center gap-2"
      >
        <NeoIcon :icon="footer.icon" />

        <p class="text-xs">
          {{ footer.label }}
        </p>
      </div>
    </template>
  </NeoMessage>
</template>

<script lang="ts" setup>
import type {
  NeoMessageIconVariant,
  NeoMessageVariant } from '@kodadot1/brick'
import {
  NeoIcon,
  NeoMessage,
} from '@kodadot1/brick'

const emit = defineEmits(['close'])
const props = withDefaults(
  defineProps<{
    title: MaybeRef<string>
    message: MaybeRef<string>
    duration?: number
    state?: Ref<LoadingNotificationState>
    variant?: MaybeRef<NeoMessageVariant>
    action?: MaybeRef<NotificationAction | undefined>
    holdTimer?: Ref<boolean>
    icon?: Ref<NeoMessageIconVariant | undefined>
    footer?: NotificationFooter
  }>(),
  {
    variant: 'success',
    duration: 10000,
    action: undefined,
    state: undefined,
    holdTimer: undefined,
    icon: undefined,
    footer: undefined,
  },
)

const title = computed(() => unref(props.title))
const message = computed(() => unref(props.message))
const action = computed(() => unref(props.action))
const holdTimer = computed(() => unref(props.holdTimer))
const icon = computed(() => unref(props.icon))
const footer = computed(() => unref(props.footer))
const variant = computed(() => unref(props.variant))
</script>
