<template>
  <div class="level-item has-text-centered">
    <div>
      <p class="title">{{ value }}</p>
      <p class="text-xs text-k-grey">
        {{ $t(header) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  value: { type: Number, default: 0 },
  header: { type: String, default: 'profileStats.totalBuys' },
})
</script>

<style lang="scss" scoped>
.collection {
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(3, 1fr);
}

.title {
  font-size: 1.2rem;
}
</style>
