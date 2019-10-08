<template>
  <div>
     <b-tabs>
        <b-tab-item label="General"></b-tab-item>
    </b-tabs>
    <SettingChooser label="Remote Node" selector="availableNodes" setter="setApiUrl" defaultValue="apiUrl" />
    <SettingChooser label="Address Prefix" selector="availablePrefixes" setter="setPrefix" defaultValue="prefix"  />
    <SettingChooser label="Interface Operation Mode" selector="availableUiModes" setter="setUiMode"  defaultValue="uiMode" />
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