<template>
  <section>
    <NeoTabs v-model="activeTab">
      <NeoTabItem label="Metadata" value="metadata">
        <Metadata />
      </NeoTabItem>
      <NeoTabItem label="Interface" value="advanced">
        <Interface />
      </NeoTabItem>
      <NeoTabItem label="Minting" value="minting">
        <Minting />
      </NeoTabItem>
      <NeoTabItem label="Keyboard shortcuts" value="keyboardShortcuts">
        <keyboard-shortcuts />
      </NeoTabItem>
    </NeoTabs>
  </section>
</template>

<script lang="ts">
import Interface from '@/components/settings/Interface.vue'
import Minting from '@/components/settings/Minting.vue'
import Metadata from '@/components/metadata/Metadata.vue'
import KeyboardShortcuts from '@/components/settings/KeyboardShortcuts.vue'
import { NeoTabItem, NeoTabs } from '@kodadot1/brick'

export default {
  name: 'SettingsPage',
  components: {
    Interface,
    Minting,
    Metadata,
    KeyboardShortcuts,
    NeoTabItem,
    NeoTabs,
  },
  setup() {
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
    return {
      activeTab,
    }
  },
  head() {
    const title = 'Settings'
    const metaData = {
      title,
      description: 'Configure your KodaDot experience',
      url: '/settings',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
