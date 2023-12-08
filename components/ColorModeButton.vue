<template>
  <div class="is-flex is-align-items-center m-0" @click="toggleColorMode">
    <ColorScheme placeholder="...">
      <span v-if="isDarkMode">{{ $t('profileMenu.lightMode') }}</span>
      <span v-else>{{ $t('profileMenu.darkMode') }}</span>
      &nbsp;<NeoIcon icon="circle-half-stroke" />
    </ColorScheme>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
const { toggleColorMode, isDarkMode } = useTheme()
</script>
