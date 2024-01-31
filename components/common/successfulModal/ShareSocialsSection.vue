<template>
  <div class="mt-5 mb-6">
    <div class="flex justify-around px-8 items-center w-full">
      <NeoButton variant="icon" no-shadow @click="handleShareOnX">
        <div class="flex flex-col text-k-grey">
          <NeoIcon pack="fab" icon="x-twitter" />
          <span class="text-center mt-1">X</span>
        </div>
      </NeoButton>

      <NeoButton
        variant="icon"
        no-shadow
        :class="{ 'mx-7': withCopy }"
        @click="handleShareOnTelegram">
        <div class="flex flex-col text-k-grey">
          <NeoIcon pack="fab" icon="telegram" />
          <span class="text-center mt-1">Telegram</span>
        </div>
      </NeoButton>

      <NeoButton
        v-if="withCopy"
        v-clipboard:copy="url"
        variant="icon"
        no-shadow
        @click="toast($t('general.copyToClipboard'))">
        <div class="flex flex-col text-k-grey">
          <NeoIcon icon="link" />
          <span class="text-center mt-1">{{ $t('general.copy') }}</span>
        </div>
      </NeoButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    text: string
    url: string
    withCopy?: boolean
  }>(),
  {
    withCopy: true,
  },
)

const { toast } = useToast()
const { shareOnX, shareOnTelegram } = useSocialShare()

const handleShareOnX = () => {
  shareOnX(props.text, props.url)
}

const handleShareOnTelegram = () => {
  shareOnTelegram(props.text, props.url)
}
</script>
