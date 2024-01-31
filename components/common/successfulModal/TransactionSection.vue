<template>
  <div
    class="border border-k-shade rounded-[4rem] py-[7px] px-2 flex items-center justify-between">
    <div
      class="text-k-green flex px-2 py-[6px] bg-k-green-accent-2 rounded-full">
      <NeoIcon icon="check" />

      <p class="ml-2 text-xs">{{ $t('confirmed') }}</p>
    </div>

    <div class="flex items-center">
      <a
        v-safe-href="txUrl"
        class="has-text-link ml-3 text-xs"
        target="_blank"
        rel="nofollow noopener noreferrer">
        {{ $t('helper.viewTx') }}
        <NeoIcon icon="arrow-up-right" />
      </a>

      <NeoIcon
        class="text-k-grey opacity-20 mx-2 is-size-8"
        icon="circle"
        pack="fass"
        size="small" />

      <NeoIcon
        v-clipboard:copy="txUrl"
        icon="copy"
        pack="fass"
        class="text-k-grey cursor-pointer"
        data-testid="tx-clipboard"
        @click="toast($t('general.copyToClipboard'))" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const props = defineProps<{
  txHash: string
}>()

const { toast } = useToast()
const { getExtrinsicUrl } = useExplorer()
const { urlPrefix } = usePrefix()

const txUrl = computed(() =>
  getExtrinsicUrl(props.txHash || '', urlPrefix.value),
)
</script>
