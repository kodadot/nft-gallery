<template>
  <div
    class="border bg-background-color shadow-primary p-5 pb-6 w-full lg:max-w-[490px] flex flex-col gap-5">
    <div>
      <CodeCheckerSandboxIFrame
        v-if="render"
        v-model:count="count"
        :hash="hash"
        :assets="assets" />

      <BaseMediaItem v-else preview is-detail class="border" />
    </div>
    <div
      class="flex pb-5 justify-between w-full gap-4 border-b border-neutral-5">
      <NeoButton
        variant="pill"
        class="w-full px-5"
        icon="arrow-rotate-left"
        @click="newHash"
        >{{ $t('codeChecker.newHash') }}</NeoButton
      >
      <NeoButton
        variant="pill"
        class="w-full px-5"
        :disabled="!selectedFile"
        @click="count++"
        >{{ $t('codeChecker.replayAnimation') }}</NeoButton
      >
    </div>
    <div>
      <span>{{ $t('codeChecker.currentHash') }}</span>
      <NeoInput
        v-model="hash"
        class="w-full mt-4 border-k-shade text-ellipsis"
        placeholder="hash value" />
    </div>
    <div v-if="selectedFile">
      <p>{{ $t('codeChecker.exportVariations') }}</p>
      <div class="mt-4 flex gap-4">
        <NeoButton
          no-shadow
          class="flex-grow text-ellipsis overflow-hidden"
          :disabled="!kodaRendererUsed"
          @click="exportAsPNG">
          {{ `Export ${fileName} as PNG` }}
        </NeoButton>
        <NeoDropdown v-model="selectedVariation">
          <template #trigger="{ active }">
            <NeoButton
              :label="`${selectedVariation}X`"
              class="w-[4rem]"
              :disabled="!kodaRendererUsed"
              no-shadow
              :active="active" />
          </template>
          <NeoDropdownItem
            v-for="option in variationOptions"
            :key="option"
            :value="option">
            {{ `${option}X` }}
          </NeoDropdownItem>
        </NeoDropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoInput,
} from '@kodadot1/brick'
import { generateRandomHash } from './utils'
import config from './codechecker.config'
import { AssetMessage, Passed } from './types'

const props = defineProps<{
  selectedFile: File | null
  assets: Array<AssetMessage>
  fileName?: string
  render: boolean
  kodaRendererUsed: Passed
}>()
const variationOptions = config.varaitionsOptions

const hash = ref('')
const count = ref(0)
const variationCounter = ref(0)
const selectedVariation = ref(variationOptions[0])

const newHash = () => {
  hash.value = generateRandomHash()
}

onMounted(newHash)

const handleRenderComplete = (
  ev: MessageEvent<{ type: string; payload: { image?: string } }>,
) => {
  if (
    ev.origin === window.location.origin &&
    ev.data?.type === 'kodahash/render/completed' &&
    ev.data.payload?.image
  ) {
    const imageName = `${props.fileName}-variation_${variationCounter.value + 1}-hash_${hash.value}.png`

    downloadBase64Image(ev.data.payload.image, imageName)

    variationCounter.value++
    if (variationCounter.value < selectedVariation.value) {
      newHash()
    } else {
      variationCounter.value = 0
      window.removeEventListener('message', handleRenderComplete)
    }
  }
}

const exportAsPNG = async () => {
  window.addEventListener('message', handleRenderComplete)
  count.value++
}
</script>
<style scoped lang="scss">
:deep(.o-drop__menu) {
  min-width: fit-content !important;
}
:deep(.o-btn__label) {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
