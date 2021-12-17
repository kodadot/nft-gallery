<template>
  <section>
    <b-tabs v-model="activeTab">
      <b-tab-item label="General">
        <General />
      </b-tab-item>
      <b-tab-item label="Metadata">
        <Metadata />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import General from '@/components/settings/General.vue'
import Metadata from '@/components/metadata/Metadata.vue'

@Component({
  components: {
    General,
    Metadata
  },
})

export default class Settings extends Vue {
  protected activeTab = 0

  public created() {
    console.log('Settings created', Object.keys(this.$apolloProvider.clients))
  }
}
</script>
