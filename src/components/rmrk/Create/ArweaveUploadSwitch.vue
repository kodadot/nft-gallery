<template>
  <b-field>
    <b-switch v-model="checkedValue" :rounded="false">
      {{ checkedValue ? $t('arweave.uploadYes') : $t('arweave.uploadNo')}}
    </b-switch>
  </b-field>
</template>

<script lang="ts" >
import { Component, Vue, ModelSync } from 'vue-property-decorator'

@Component({})
export default class ArweaveUploadSwitch extends Vue {
  @ModelSync('value', 'input', { type: Boolean })
  readonly checkedValue!: boolean
}
</script>
