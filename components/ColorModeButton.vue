<template>
  <div
    class="is-flex is-align-items-center m-0"
    :class="isMobileDevice ? 'navbar-item' : ''"
    @click="toggleColorMode">
    <ColorScheme placeholder="...">
      <span v-if="colorMode.preference === 'dark'">
        {{ $t('profileMenu.lightMode') }}
      </span>
      <span v-else>{{ $t('profileMenu.darkMode') }}</span>
      &nbsp;<NeoIcon icon="circle-half-stroke" />
    </ColorScheme>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
import { isMobileDevice } from '@/utils/extension'
const { colorMode, toggleColorMode } = useTheme()
</script>
