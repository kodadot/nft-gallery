<template>
  <div class="card">
    <div class="card-content summary-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SummaryCard extends Vue {

}
</script>

<style scoped>
.summary-content {
	display: flex;
	justify-content: space-between;
	flex-flow: wrap;
}

</style>
