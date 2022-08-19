<template>
  <div>
    <Identity address="DuF6X8DeDxcF3vgedZ2vwXMGNKWyJ7ytygWuW1xW76y8QBd" />
    <Identity address="Gi9bsjnHLHmXHBaQW3Z8Hpjq7RN6ikGfbC12A49SMkzAqTh" />
    <Identity address="FQBgFrkzevAZCvFZB485rQa6h7gsZQz3UXRuYwxAzG7zQ4w" />
    <Identity address="GHoyYbdFWAsjACxgfAofb2M9KPARrbJCm1ZfZpzKyig9XRJ" />
    <!-- <Identity :address="address" show-onchain-identity />
    <Identity :address="address" hide-identity-popover /> -->
  </div>
</template>

<script lang="ts" setup>
import Identity from '@/components/shared/identity/IdentityIndex.vue'

const address = 'FQBgFrkzevAZCvFZB485rQa6h7gsZQz3UXRuYwxAzG7zQ4w'
</script>
