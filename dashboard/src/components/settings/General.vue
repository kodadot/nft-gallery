<template>
  <div>
    <SettingChooser label="Node URL" selector="availableNodes" setter="setApiUrl" defaultValue="apiUrl" addOption="local" addMethod="addNode" />
    <SettingChooser label="Address Prefix" selector="availablePrefixes" setter="setPrefix" defaultValue="prefix"  />
    <SettingChooser label="Default Icon Theme" selector="availableIcons" setter="setIcon"  defaultValue="icon" />
    <SettingChooser label="Interface Operation Mode" selector="availableUiModes" setter="setUiMode"  defaultValue="uiMode" />
    <!-- <SettingChooser label="Interface Operation Mode" selector="availableLocking" setter="setLocking"  defaultValue="locking" /> -->
    <SettingChooserExplorer label="Default Explorer Provider" selector="provider" setter="setExplorer" defaultValue="0" />
    <SettingChooserExplorer label="Default Explorer Chain" selector="chain" setter="setExplorer" defaultValue="0" />
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SettingChooser from '../settings/SettingChooser.vue';
import SettingChooserExplorer from '@/components/settings/SettingChooserExplorer.vue'

@Component({
  components: {
    SettingChooser,
    SettingChooserExplorer,
  },
})
export default class General extends Vue {

}
</script>
