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
        class="w-full mt-4 border-k-shade"
        placeholder="hash value" />
    </div>
    <div v-if="selectedFile">
      <p>{{ $t('codeChecker.exportVariations') }}</p>
      <div class="mt-4 flex gap-4">
        <NeoButton
          no-shadow
          class="flex-grow text-ellipsis overflow-hidden"
          @click="() => {}">
          {{ `Export ${fileName} as PNG` }}
        </NeoButton>
        <NeoDropdown v-model="selectedVariation">
          <template #trigger="{ active }">
            <NeoButton
              :label="`${selectedVariation}X`"
              class="w-[4rem]"
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
import { AssetMessage, generateRandomHash } from './utils'
import config from './codechecker.config'

defineProps<{
  selectedFile: File | null
  assets: Array<AssetMessage>
  fileName?: string
  render: boolean
}>()

const hash = ref('')
const count = ref(0)

const newHash = async () => {
  hash.value = await generateRandomHash()
}

onMounted(newHash)

const variationOptions = config.varaitionsOptions
const selectedVariation = ref(variationOptions[0])
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
