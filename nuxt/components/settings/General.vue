<template>
  <div>
    <SettingChooser label="Node URL" selector="availableNodes" setter="setApiUrl" defaultValue="apiUrl" addOption="local" addMethod="addNode" />
    <SettingChooser label="Address Prefix" selector="availablePrefixes" setter="setPrefix" defaultValue="prefix"  />
    <SettingChooser label="Default Icon Theme" selector="availableIcons" setter="setIcon"  defaultValue="icon" />
    <SettingChooser label="Interface Operation Mode" selector="availableUiModes" setter="setUiMode"  defaultValue="uiMode" />
    <!-- <SettingChooser label="Interface Operation Mode" selector="availableLocking" setter="setLocking"  defaultValue="locking" /> -->
    <!-- <SettingChooserExplorer label="Default Explorer Provider" selector="provider" setter="setExplorer" defaultValue="0" />
    <SettingChooserExplorer label="Default Explorer Chain" selector="chain" setter="setExplorer" defaultValue="0" />
    <SettingChooserDevelopment label="Development Mode" selector="options" setter="setDevelopment" /> -->
    <b-button :style="{ marginTop: '1em' }" @click="refresh" type="is-primary">Clear Cache & Reload</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
