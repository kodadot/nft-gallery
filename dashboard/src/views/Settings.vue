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

