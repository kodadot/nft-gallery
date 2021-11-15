<template>
  <b-tabs type="is-toggle" v-model="selectedAction" size="is-small">
    <b-tab-item label="CONSUME" icon="fire" value="CONSUME"></b-tab-item>
    <b-tab-item label="SEND" icon="paper-plane" value="SEND"></b-tab-item>
    <b-tab-item label="LIST" icon="money-bill" value="LIST" disabled></b-tab-item>
  </b-tabs>
</template>

<script lang="ts" >
import { Component, VModel, Vue } from 'nuxt-property-decorator'
@Component({})
export default class ActionSelector extends Vue {
  @VModel({ type: String, default: 'CONSUME' }) selectedAction!: string;
}
</script>
