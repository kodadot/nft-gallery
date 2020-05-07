<template>
  <div>
    <b-tabs v-model="activeTab">
      <!-- <b-tab-item label="Hash data">

      </b-tab-item> -->
      <b-tab-item label="Sign message">
        <SignMessage />
      </b-tab-item>
      <b-tab-item label="Verify signature">

      </b-tab-item>
    </b-tabs>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SignMessage from './SignMessage.vue';

@Component({
  components: {
    SignMessage
  }
})
export default class ToolBox extends Vue {

  private activeTab: number = 0;
  private value2: any;
  @Prop() public value!: any;
}
</script>
