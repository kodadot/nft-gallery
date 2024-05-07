<template>
  <div>
    <TransactionSection v-if="txHash" :tx-hash="txHash" />

    <div class="mt-5">
      <slot />
    </div>

    <hr class="!my-5" />

    <ShareSocialsSection
      :text="share.text"
      :url="share.url"
      :with-copy="share.withCopy"
      :social="share.social" />

    <slot name="actions">
      <ActionButtons
        :primary="actionButtons.primary"
        :secondary="actionButtons.secondary"
        @primary="actionButtons.primary.onClick"
        @secondary="handleSecondaryActionClick" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { type ActionButton } from './ActionButtons.vue'
import { SocialMediaProps } from './ShareSocialsSection.vue'

export type ShareProp = {
  text: string
  url: string
  withCopy?: boolean
  social?: SocialMediaProps
}
type ActionButtonWithHandler = ActionButton & { onClick: () => void }

export type ActionButtonsProp = {
  primary: ActionButtonWithHandler
  secondary?: ActionButtonWithHandler
}

const props = defineProps<{
  txHash?: string
  share: ShareProp
  actionButtons: ActionButtonsProp
}>()

const handleSecondaryActionClick = () => {
  if (props.actionButtons.secondary) {
    props.actionButtons.secondary.onClick()
  }
}
</script>
