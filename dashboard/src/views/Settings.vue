<template>
  <div>
     <b-tabs>
        <b-tab-item label="General"></b-tab-item>
    </b-tabs>
    <SettingChooser label="Node URL" selector="availableNodes" setter="setApiUrl" defaultValue="apiUrl" addOption="local" addMethod="addNode" />
    <SettingChooser label="Address Prefix" selector="availablePrefixes" setter="setPrefix" defaultValue="prefix"  />
    <SettingChooser label="Default Icon Theme" selector="availableIcons" setter="setIcon"  defaultValue="icon" />
    <SettingChooser label="Interface Operation Mode" selector="availableUiModes" setter="setUiMode"  defaultValue="uiMode" />
    <!-- <SettingChooser label="Interface Operation Mode" selector="availableLocking" setter="setLocking"  defaultValue="locking" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SettingChooser from '../components/settings/SettingChooser.vue';

@Component({
  components: {
    SettingChooser,
  },
})
export default class Settings extends Vue {
}
</script>