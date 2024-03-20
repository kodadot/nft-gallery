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

type COLOR_MODE = 'system' | 'light' | 'dark'

const { isDarkMode, preference, setColorMode, isSystemMode } = useTheme()
const { isMobile } = useViewport()

const { $i18n } = useNuxtApp()

const options = computed<{ value: COLOR_MODE; icon: string; label: string }[]>(
  () => [
    {
      value: 'system',
      icon: 'computer-classic',
      label: isSystemMode.value
        ? $i18n.t('profileMenu.systemMode', [
            isDarkMode.value
              ? $i18n.t('profileMenu.dark')
              : $i18n.t('profileMenu.light'),
          ])
        : $i18n.t('profileMenu.system'),
    },
    {
      value: 'light',
      icon: 'sun',
      label: $i18n.t('profileMenu.lightMode'),
    },
    {
      value: 'dark',
      icon: 'moon',
      label: $i18n.t('profileMenu.darkMode'),
    },
  ],
)

const currentModeIndex = computed(() =>
  options.value.findIndex((option) => option.value === preference.value),
)

const currentMode = computed(() => options.value[currentModeIndex.value || 0])

const switchToNextMode = () => {
  const nextIndex = (currentModeIndex.value + 1) % options.value.length
  setColorMode(options.value[nextIndex].value)
}

const onChange = (option) => {
  setColorMode(option.value)
}
</script>
