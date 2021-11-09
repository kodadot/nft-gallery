<template>
  <div class="offline">
    <div class="offline-message">
      You are currently offline
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

@Component({})
export default class Offline extends Vue {}
</script>

<style scoped>
.offline {
  display: flex;
  align-content: center;
  justify-content: center;
  height: 100vh;
}

.offline-message {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
