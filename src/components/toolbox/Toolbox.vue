<template>
  <div>
    <b-tabs v-model="activeTab" multiline>
      <b-tab-item label="Hash data">
        <HashData />
      </b-tab-item>
      <b-tab-item label="Sign message">
        <SignMessage />
      </b-tab-item>
      <b-tab-item label="Verify signature">
        <VerifySignature />
      </b-tab-item>
      <b-tab-item label="Convert address">
        <ConvertAddress />
      </b-tab-item>
    </b-tabs>
  </div>
</template>
<script lang="ts" >
import { Component, Vue, Watch } from 'vue-property-decorator'
import SignMessage from './SignMessage.vue'
import VerifySignature from './VerifySignature.vue'
import HashData from './HashData.vue'
import ConvertAddress from './ConvertAddress.vue'

const currentTabs: any = {
  hash: 0,
  sign: 1,
  verify: 2,
  convert: 3
}

@Component({
  components: {
    SignMessage,
    VerifySignature,
    HashData,
    ConvertAddress
  }
})
export default class ToolBox extends Vue {
  private activeTab = 0;

  private mounted() {
    const value = this.$route.params.tab
    this.updateActiveTab(value)
  }

  @Watch('$route.params.tab')
  handleActiveTab(value: string) {
    this.updateActiveTab(value)
  }

  private updateActiveTab(value: string) {
    console.log('TAB', value)
    this.activeTab = currentTabs[value] || 0
  }
}
</script>
