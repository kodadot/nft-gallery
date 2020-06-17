<template>
  <div>
    <b-tabs v-model="activeTab" multiline >
      <b-tab-item label="Hash data">
        <HashData />
      </b-tab-item>
      <b-tab-item label="Sign message">
        <SignMessage />
      </b-tab-item>
      <b-tab-item label="Verify signature">
        <VerifySignature />
      </b-tab-item>
    </b-tabs>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SignMessage from './SignMessage.vue';
import VerifySignature from './VerifySignature.vue';
import HashData from './HashData.vue';
@Component({
  components: {
    SignMessage,
    VerifySignature,
    HashData,
  }
})
export default class ToolBox extends Vue {
  private activeTab: number = 0;
}
</script>
