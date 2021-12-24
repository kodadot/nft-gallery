<template>
  <section>
    <b-tabs v-model="activeTab">
      <b-tab-item label="General">
        <General />
      </b-tab-item>
      <b-tab-item label="Metadata">
        <Metadata />
      </b-tab-item>
      <b-tab-item label="Interface">
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
    Interface
  },
})

export default class Settings extends Vue {
  private activeTab = 0
}
</script>
