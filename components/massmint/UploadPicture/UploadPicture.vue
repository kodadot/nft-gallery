<template>
  <div>
    <NeoCollapse>
      <NeoCollapseItem>
        <template #title> Upload Pictures </template>
        <template #content> custom content </template>
      </NeoCollapseItem>
      <NeoCollapseItem>
        <template #title> Upload Description File (Optional) </template>
        <template #content> custom content </template>
      </NeoCollapseItem>
    </NeoCollapse>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapse, NeoCollapseItem } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { useMassMint } from '../useMassMint'
const preferencesStore = usePreferencesStore()
const { $consola } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { urlPrefix } = usePrefix()
</script>

<style lang="scss" scoped>
@import './UploadPicture.scss';
</style>
