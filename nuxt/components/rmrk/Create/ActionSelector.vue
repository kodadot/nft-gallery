<template>
  <b-tabs
    v-model="selectedAction"
    type="is-toggle"
    size="is-small"
  >
    <b-tab-item
      label="CONSUME"
      icon="fire"
      value="CONSUME"
    />
    <b-tab-item
      label="LIST"
      icon="money-bill"
      value="LIST"
      disabled
    />
    <b-tab-item
      label="SEND"
      icon="paper-plane"
      value="SEND"
      disabled
    />
  </b-tabs>
</template>

<script lang="ts" >
import { Component, VModel, Vue } from 'nuxt-property-decorator'
@Component({})
export default class ActionSelector extends Vue {
  @VModel({ type: String, default: 'CONSUME' }) selectedAction!: string;
}
</script>
