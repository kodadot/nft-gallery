<template>
  <div>
    <SettingChooser
      label="Node URL"
      selector="availableNodes"
      setter="setApiUrl"
      default-value="apiUrl"
      add-option="local"
      add-method="addNode"
    />
    <SettingChooser
      label="Address Prefix"
      selector="availablePrefixes"
      setter="setPrefix"
      default-value="prefix"
    />
    <SettingChooser
      label="Default Icon Theme"
      selector="availableIcons"
      setter="setIcon"
      default-value="icon"
    />
    <!-- <SettingChooser label="Interface Operation Mode" selector="availableLocking" setter="setLocking"  defaultValue="locking" /> -->
    <!-- <SettingChooserExplorer label="Default Explorer Provider" selector="provider" setter="setExplorer" defaultValue="0" />
    <SettingChooserExplorer label="Default Explorer Chain" selector="chain" setter="setExplorer" defaultValue="0" />
    <SettingChooserDevelopment label="Development Mode" selector="options" setter="setDevelopment" /> -->
    <b-button
      :style="{ marginTop: '1em' }"
      type="is-primary"
      @click="refresh"
    >
      Clear Cache & Reload
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SettingChooser from '../settings/SettingChooser.vue'
import SettingChooserExplorer from '@/components/settings/SettingChooserExplorer.vue'
import SettingChooserDevelopment from '@/components/settings/SettingChooserDevelopment.vue'

@Component({
  components: {
    SettingChooser,
    SettingChooserExplorer,
    SettingChooserDevelopment
  },
})
export default class General extends Vue {

  // DEV: Not happy about this
  protected refresh() {
    window.sessionStorage.removeItem('vuex')
    window.location.reload()
  }

}
</script>
