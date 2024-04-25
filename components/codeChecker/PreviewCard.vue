<template>
  <div
    class="border bg-background-color shadow-primary p-5 pb-6 w-full max-w-[490px] flex flex-col gap-5">
    <div ref="fullscreenRef">
      <NeoButton
        v-if="isFullscreen"
        class="fixed top-[3rem] left-[3rem] z-[1]"
        icon-left="chevron-left"
        @click="toggleFullscreen">
        <div class="mr-2">{{ $t('massmint.goBack') }}</div>
      </NeoButton>

      <CodeCheckerSandboxIFrame
        v-if="render"
        v-model:count="count"
        :custom-class="{ border: !isFullscreen }"
        :hash="hash"
        :assets="assets" />
      <BaseMediaItem v-else preview is-detail class="border" />
    </div>
    <div class="pb-5 flex w-full gap-3 border-b border-neutral-5 flex-wrap">
      <NeoButton
        rounded
        no-shadow
        class="px-5 flex-1 border-k-grey hover:!bg-transparent"
        icon-right="arrow-rotate-left"
        @click="newHash"
        >{{ $t('codeChecker.newHash') }}</NeoButton
      >
      <NeoButton
        rounded
        no-shadow
        class="flex-1 border-k-grey hover:!bg-transparent"
        :disabled="!selectedFile"
        @click="replay"
        >{{ $t('codeChecker.replayAnimation') }}</NeoButton
      >
      <NeoButton
        rounded
        no-shadow
        :disabled="!render"
        class="border-k-grey px-4 hover:!bg-transparent"
        icon="arrow-up-right-and-arrow-down-left-from-center"
        @click="toggleFullscreen"></NeoButton>
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
          <span class="text-k-grey">{{ `Export ${fileName} as PNG` }}</span>
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
import { useFullscreen } from '@vueuse/core'

import { generateRandomHash } from './utils'
import config from './codechecker.config'
import { AssetMessage, Passed } from './types'

const props = defineProps<{
  selectedFile: File | null
  assets: Array<AssetMessage>
  fileName?: string
  render: boolean
  kodaRendererUsed: Passed
  reloadTrigger: number
}>()

const fullscreenRef = ref<HTMLElement | null>(null)

const { toggle: toggleFullscreen, isFullscreen } = useFullscreen(fullscreenRef)

const emit = defineEmits(['reload'])
const variationOptions = config.varaitionsOptions

const hash = ref('')
const count = ref(0)
const variationCounter = ref(0)
const selectedVariation = ref(variationOptions[0])

useMediaFullscreen({
  ref: fullscreenRef,
  isFullscreen,
})

const newHash = () => {
  hash.value = generateRandomHash()
  emit('reload')
}

const replay = () => {
  count.value++
  emit('reload')
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

watch(() => props.reloadTrigger, replay)
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
