<template>
  <div
    class="flex items-center m-0"
    :class="isMobileDevice ? 'navbar-item' : ''"
    @click="switchToNextMode"
  >
    <ColorScheme placeholder="...">
      <span>{{ currentMode.label }}</span>
      &nbsp;<KIcon :name="currentMode.icon" />
    </ColorScheme>
  </div>
</template>

<script lang="ts" setup>
import { isMobileDevice } from '@/utils/extension'

const { currentMode, switchToNextMode } = useTheme()
</script>
