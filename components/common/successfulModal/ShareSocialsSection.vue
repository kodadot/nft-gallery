<template>
  <div class="my-5">
    <div
      :class="[
        `flex justify-around px-8 items-center w-full gap-6`,
        { '!gap-4': withCopy },
      ]">
      <NeoTooltip label="X">
        <NeoButton variant="icon" no-shadow @click="handleShareOnX">
          <NeoIcon pack="fab" icon="x-twitter" class="text-k-grey" />
        </NeoButton>
      </NeoTooltip>
      <NeoTooltip v-if="showFarcaster" label="Farcaster">
        <NeoButton variant="icon" no-shadow @click="handleShareOnFarcaster">
          <FarcasterIcon class="text-k-grey" />
        </NeoButton>
      </NeoTooltip>

      <NeoTooltip label="Telegram">
        <NeoButton variant="icon" no-shadow @click="handleShareOnTelegram">
          <NeoIcon class="text-k-grey" pack="fab" icon="telegram" />
        </NeoButton>
      </NeoTooltip>
      <NeoTooltip v-if="withCopy" :label="$t('general.copy')">
        <NeoButton
          v-clipboard:copy="url"
          variant="icon"
          no-shadow
          @click="toast($t('general.copyToClipboard'))">
          <NeoIcon icon="link" class="text-k-grey" />
        </NeoButton>
      </NeoTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoTooltip } from '@kodadot1/brick'
const FarcasterIcon = defineAsyncComponent(
  () => import('@/assets/icons/farcaster-icon.svg?component'),
)

export type SocialMediaProps = {
  farcaster?: { embeds: string[] }
}

const props = withDefaults(
  defineProps<{
    text: string
    url: string
    withCopy?: boolean
    showFarcaster?: boolean
    social?: SocialMediaProps
  }>(),
  {
    withCopy: true,
    showFarcaster: true,
    social: undefined,
  },
)

const { toast } = useToast()
const { shareOnX, shareOnTelegram, shareOnFarcaster } = useSocialShare()

const handleShareOnX = () => {
  shareOnX(props.text, props.url)
}

const handleShareOnTelegram = () => {
  shareOnTelegram(props.text, props.url)
}
const handleShareOnFarcaster = () => {
  shareOnFarcaster(props.text, props.social?.farcaster?.embeds ?? [props.url])
}
</script>
