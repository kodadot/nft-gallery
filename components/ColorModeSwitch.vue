<template>
  <ColorScheme>
    <NeoDropdown
      v-model="preference"
      position="top-left"
      :close-on-click="true"
      mobile-modal
      aria-role="list"
      @change="onChange">
      <template #trigger>
        <div class="flex items-center cursor-pointer">
          <NeoIcon :icon="currentMode.icon" size="medium" />
          <span class="ml-1">{{ currentMode?.label }}</span>
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
const { isDarkMode, preference, setColorMode, isSystemMode } = useTheme()
const { $i18n } = useNuxtApp()

const options = computed(() => [
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
])

const currentMode = computed(
  () =>
    options.value.find((option) => option.value === preference.value) ||
    options.value[0],
)

const onChange = (option) => {
  setColorMode(option.value)
}
</script>
