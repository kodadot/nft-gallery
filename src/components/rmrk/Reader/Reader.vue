<template>
  <div>
    <b-field label="Remark String">
      <b-input type="textarea" v-model="rmrkString" />
    </b-field>
    <!-- <b-field label="Block Number">
      <b-input placeholder="Block Number" v-model="blockNumber" />
    </b-field>
    <b-field label="Extrinsics Hash">
      <b-input placeholder="hash" v-model="hash" />
    </b-field> -->
    <b-button @click="handleRmrk" :disabled="disabled" type="is-primary" outlined>View</b-button>
    <RmrkNftView :rmrk="rmrkView" />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { RMRK } from '../types'
import { decodeRmrkString } from '../utils'
import { emptyObject } from '@/utils/empty'
import RmrkNftView from './RmrkNftView.vue'

const components = { RmrkNftView }

@Component({ components })
export default class Reader extends Vue {
  private rmrkString = '';
  private blockNumber = '';
  private hash = '';
  private rmrkView: RMRK = emptyObject<RMRK>();


  private handleRmrk() {
    const { rmrkString, blockNumber, hash, handleRmrkString } = this
    if (rmrkString) {
      handleRmrkString(rmrkString)
      return
    }

    if (blockNumber) {
      // pass
      return
    }

    if (hash) {
      // pass
      return
    }
  }

  private handleRmrkString(rmrkString: string) {
    this.rmrkView = decodeRmrkString(rmrkString)
    console.log(this.rmrkView)
  }

  get disabled() {
    const { rmrkString, blockNumber, hash } = this
    return !(rmrkString || blockNumber || hash)
  }
}
</script>
