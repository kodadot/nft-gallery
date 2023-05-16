<template>
  <section>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Metadata" value="metadata">
        <Metadata />
      </b-tab-item>
      <b-tab-item label="Interface" value="advanced">
        <Interface />
      </b-tab-item>
      <b-tab-item label="Minting" value="minting">
        <Minting />
      </b-tab-item>
      <b-tab-item label="Keyboard shortcuts" value="keyboardShortcuts">
        <keyboard-shortcuts />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts" setup>
import Interface from '@/components/settings/Interface.vue'
import Minting from '@/components/settings/Minting.vue'
import Metadata from '@/components/metadata/Metadata.vue'
import KeyboardShortcuts from '@/components/settings/KeyboardShortcuts.vue'

const { $route, $router } = useNuxtApp()
const activeTab = computed({
  get: () => $route.query.tab || 'metadata',
  set: (value) => {
    $route.query.page = ''
    $router.replace({
      query: { tab: value },
    })
  },
})
</script>
