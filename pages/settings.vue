<template>
  <section>
    <NeoTabs v-model="activeTab">
      <NeoTabItem label="Metadata" value="metadata">
        <SettingsMetadata />
      </NeoTabItem>
      <NeoTabItem label="Interface" value="advanced">
        <SettingsInterface />
      </NeoTabItem>
      <NeoTabItem label="Minting" value="minting">
        <SettingsMinting />
      </NeoTabItem>
      <NeoTabItem label="Keyboard shortcuts" value="keyboardShortcuts">
        <SettingsKeyboardShortcuts />
      </NeoTabItem>
    </NeoTabs>
  </section>
</template>

<script lang="ts" setup>
import { NeoTabItem, NeoTabs } from '@kodadot1/brick'

const route = useRoute()
const router = useRouter()
const activeTab = computed({
  get: () => route.query.tab || 'metadata',
  set: (value) => {
    route.query.page = ''
    router.replace({
      query: { tab: value },
    })
  },
})

useHead({
  title: 'Settings',
  meta: [
    {
      name: 'description',
      content: 'Configure your KodaDot experience',
    },
  ],
})
</script>
