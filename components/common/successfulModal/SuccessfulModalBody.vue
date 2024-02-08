<template>
  <div>
    <TransactionSection :tx-hash="txHash" class="mb-5" />

    <slot />

    <hr class="!my-5" />

    <ShareSocialsSection
      :text="share.text"
      :url="share.url"
      :with-copy="share.withCopy" />

    <slot name="actions">
      <ActionButtons
        :primary="actionButtons.primary"
        :secondary="actionButtons.secondary"
        @primary="actionButtons.primary.onClick"
        @secondary="actionButtons.secondary.onClick" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { type ActionButton } from './ActionButtons.vue'

export type ShareProp = { text: string; url: string; withCopy?: boolean }
type ActionButtonWithHandler = ActionButton & { onClick: () => void }

export type ActionButtonsProp = {
  primary: ActionButtonWithHandler
  secondary: ActionButtonWithHandler
}

defineProps<{
  txHash: string
  share: ShareProp
  actionButtons: ActionButtonsProp
}>()
</script>
