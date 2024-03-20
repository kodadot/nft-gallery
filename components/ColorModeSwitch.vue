<template>
  <ColorScheme>
    <NeoIcon
      v-if="isMobile"
      class="cursor-pointer"
      :icon="currentMode.icon"
      size="medium"
      @click="switchToNextMode" />
    <NeoDropdown
      v-else
      v-model="preference"
      position="top-left"
      :close-on-click="true"
      aria-role="list"
      @change="onChange">
      <template #trigger>
        <div class="flex items-center cursor-pointer">
          <NeoIcon :icon="currentMode.icon" size="medium" />
          <span class="ml-1 min-w-[82px]">{{ currentMode?.label }}</span>
        </div>
      </template>
      <NeoDropdownItem
        v-for="option in options"
        :key="option.value"
        aria-role="listitem"
        class="flex"
        :active="preference === option.value"
        :value="option">
        <NeoIcon class="mr-2" :icon="option.icon" />
        <span>{{ option.label }}</span>
      </NeoDropdownItem>
    </NeoDropdown>
  </ColorScheme>
</template>

<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem, NeoIcon } from '@kodadot1/brick'

const {
  preference,
  setColorMode,
  themeOptions: options,
  currentMode,
  switchToNextMode,
} = useTheme()
const { isMobile } = useViewport()

const onChange = (option) => {
  setColorMode(option.value)
}
</script>
