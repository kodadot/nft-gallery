<template>
  <b-field>
    <b-switch v-model="checkedValue" :rounded="false">
      <div class="is-flex is-align-items-center">
        <span class="mr-2">
          {{ checkedValue ? $t('arweave.uploadYes') : $t('arweave.uploadNo') }}
        </span>
        <slot name="tooltip" />
      </div>
    </b-switch>
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, ModelSync } from 'nuxt-property-decorator';

@Component({})
export default class ArweaveUploadSwitch extends Vue {
  @ModelSync('value', 'input', { type: Boolean })
  readonly checkedValue!: boolean;
}
</script>
