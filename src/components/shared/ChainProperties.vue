<template>
  <div id="chainProps">
    {{ chainProperties }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Balance extends Vue {
  private chainProperties = null;

  get chainProps() {
  	return this.chainProperties
  }

  public async mounted(): Promise<void> {
  	const { api } = (this as any).$http
  	this.chainProperties = await api.registry.getChainProperties()
  }
}

</script>
