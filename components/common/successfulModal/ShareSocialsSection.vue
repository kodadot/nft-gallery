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
        class="mx-7"
        @click="handleShareOnTelegram">
        <div class="flex flex-col text-k-grey">
          <NeoIcon pack="fab" icon="telegram" />
          <span class="text-center mt-1">Telegram</span>
        </div>
      </NeoButton>

      <NeoButton
        v-clipboard:copy="nftFullUrl"
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

const props = defineProps<{
  url: string
}>()

const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { shareOnX, shareOnTelegram } = useSocialShare()

const sharingTxt = $i18n.t('sharing.nft')

const nftFullUrl = computed(() => `${window.location.origin}${props.url}`)

const handleShareOnX = () => {
  shareOnX(sharingTxt, nftFullUrl.value)
}

const handleShareOnTelegram = () => {
  shareOnTelegram(sharingTxt, nftFullUrl.value)
}
</script>
