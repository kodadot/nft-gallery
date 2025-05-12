<template>
  <InfoBox
    variant="fail"
    :title="$t('transfers.invalidAddress.wrong_network_address.title')"
    :closeable="false"
  >
    <div
      v-dompurify-html="
        $t(`airdrop.addressFormatWarning`, {
          addressChain: targetPrefix,
          selectedChain: currentChainName,
          ecosystem: ecosystem,
        })
      "
    />

    <template #footer>
      <div class="flex flex-wrap items-center gap-2">
        <NeoButton
          no-shadow
          rounded
          size="small"
          class="border !border-text-color"
          variant="k-pink"
          @click="changeAddress"
        >
          {{
            $t(`transfers.invalidAddress.changeToChainAddress`, {
              selectedChain: currentChainName,
            })
          }}
        </NeoButton>
        <a
          v-safe-href="`https://www.youtube.com/watch?v=3gPvGym8H7I`"
          target="_blank"
          class="text-xs underline"
        >
          {{ $t('helper.learnMore') }}
        </a>
      </div>
    </template>
  </InfoBox>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { type Prefix, chainNames, ecosystemNames } from '@kodadot1/static'
import InfoBox from '@/components/shared/view/InfoBox.vue'

const enablePrefix: Prefix[] = ['ahk', 'ahp']

const emit = defineEmits(['change'])

const { urlPrefix } = usePrefix()
const currentChainName = computed(() => chainNames[urlPrefix.value])
const { vm } = useChain()

const targetPrefix = computed(() => chainNames[enablePrefix.filter(prefix => prefix !== urlPrefix.value)[0]])

const ecosystem = computed(() => ecosystemNames[vm.value])

const changeAddress = () => {
  emit('change')
}
</script>
