<template>
  <div>
       <b-tabs v-model="activeTab">
      <b-tab-item label="General">
        <General />
      </b-tab-item>
      <b-tab-item label="Metadata">
        <Metadata />
      </b-tab-item>
    </b-tabs>
    <SettingChooser label="Node URL" selector="availableNodes" setter="setApiUrl" defaultValue="apiUrl" addOption="local" addMethod="addNode" />
    <SettingChooser label="Address Prefix" selector="availablePrefixes" setter="setPrefix" defaultValue="prefix"  />
    <SettingChooser label="Default Icon Theme" selector="availableIcons" setter="setIcon"  defaultValue="icon" />
    <SettingChooser label="Interface Operation Mode" selector="availableUiModes" setter="setUiMode"  defaultValue="uiMode" />
    <!-- <SettingChooser label="Interface Operation Mode" selector="availableLocking" setter="setLocking"  defaultValue="locking" /> -->
    <SettingChooserExplorer label="Default Explorer Provider" selector="provider" setter="setExplorer" defaultValue="0" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import General from '@/components/settings/General.vue';
import Metadata from '@/components/metadata/Metadata.vue';


@Component({
  components: {
    General,
    Metadata
  },
})
export default class Settings extends Vue {
  private activeTab: number = 0;


}
</script>

