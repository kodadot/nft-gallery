<template>
  <section>
    <b-tabs v-model="activeTab">
      <b-tab-item label="General" value="general">
        <General />
      </b-tab-item>
      <b-tab-item label="Metadata" value="metadata">
        <Metadata />
      </b-tab-item>
      <b-tab-item label="Interface" value="advanced">
        <Interface />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import General from '@/components/settings/General.vue'
import Interface from '@/components/settings/Interface.vue'
import Metadata from '@/components/metadata/Metadata.vue'

@Component({
  components: {
    General,
    Metadata,
    Interface,
  },
})
export default class Settings extends Vue {
  get activeTab(): string {
    return (this.$route.query.tab as string) || 'general'
  }

  set activeTab(val) {
    this.$route.query.page = ''
    this.$router.replace({
      query: { tab: val },
    })
  }
}
</script>
