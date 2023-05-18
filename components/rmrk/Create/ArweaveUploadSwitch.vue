<template>
  <NeoField>
    <NeoSwitch v-model="checkedValue" :rounded="false">
      <div class="is-flex is-align-items-center">
        <span class="mr-2">
          {{ checkedValue ? $t('arweave.uploadYes') : $t('arweave.uploadNo') }}
        </span>
        <slot name="tooltip" />
      </div>
    </NeoSwitch>
  </NeoField>
</template>

<script lang="ts">
import { Component, ModelSync, Vue } from 'nuxt-property-decorator'
import { NeoField } from '@kodadot1/brick'

@Component({
  components: {
    NeoField,
  },
})

import { NeoSwitch } from '@kodadot1/brick'

@Component({ components: { NeoSwitch } })
export default class ArweaveUploadSwitch extends Vue {
  @ModelSync('value', 'input', { type: Boolean })
  readonly checkedValue!: boolean
}
</script>
