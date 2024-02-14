<template>
  <div
    class="border bg-background-color shadow-primary p-5 pb-6 w-full lg:max-w-[490px] flex flex-col gap-5">
    <div>
      <CodeCheckerSandboxIFrame
        v-if="render"
        :hash="hash"
        :code="fileContent as string" />

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
        @click="() => {}"
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
        <NeoButton no-shadow class="flex-grow" @click="() => {}">{{
          `Export ${fileName} as PNG`
        }}</NeoButton>
        <NeoDropdown v-model="selectedVariation" class="w-[3.5rem]">
          <template #trigger="{ active }">
            <NeoButton
              :label="`${selectedVariation}X`"
              class="w-full"
              no-shadow
              :active="active" />
          </template>
          <NeoDropdownItem
            v-for="option in variationOptions"
            :key="option"
            class="w-[3.5rem]"
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

defineProps<{
  selectedFile: File | null
  fileContent?: string
  fileName?: string
  render: boolean
}>()

const selectedVariation = ref(1)
const variationOptions = [1, 3, 5, 10, 15, 20]

const hash = ref('')

const newHash = async () => {
  hash.value = await generateRandomHash()
}

onMounted(newHash)
</script>
<style scoped lang="scss">
:deep(.o-drop__menu) {
  min-width: fit-content !important;
}
</style>
