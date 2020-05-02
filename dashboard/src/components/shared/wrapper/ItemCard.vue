<template>
  <div class="card item-card">
    <div class="card-content item-card-content columns is-vcentered">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card.item-card{
  margin-bottom: 1em;
}

.card-content.item-card-content {
  padding: 0 0.5em;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export default class ItemCard extends Vue {
}
</script>
