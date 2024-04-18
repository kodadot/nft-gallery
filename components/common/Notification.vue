<template>
  <NeoMessage
    :duration="duration"
    :title="title"
    :variant="variant"
    auto-close
    @close="emit('close')">
    <div class="flex gap-2 flex-col">
      <p class="text-k-grey text-sm">{{ message }}</p>

      <a
        class="text-[16px] !text-text-color"
        :href="variantAction.url"
        target="_blank">
        {{ variantAction.label }}
      </a>
    </div>
  </NeoMessage>
</template>

<script lang="ts" setup>
import { NeoMessage, NeoMessageVariant } from '@kodadot1/brick'

const emit = defineEmits(['close'])
const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    duration?: number
    variant?: NeoMessageVariant
  }>(),
  {
    variant: 'success',
    duration: 10000,
  },
)

const { $i18n } = useNuxtApp()

const variantAction = computed<{ label: string; url: string }>(() => {
  if ('info' === props.variant) {
    return {
      label: $i18n.t('helper.learnMore'),
      url: '',
    }
  }

  return {
    label: $i18n.t('helper.reportIssue'),
    url: 'https://github.com/kodadot/nft-gallery/issues/new/choose',
  }
})
</script>
