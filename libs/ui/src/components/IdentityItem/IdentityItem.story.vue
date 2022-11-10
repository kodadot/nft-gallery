<template>
  <Story>
    <IdentityItem :label="label" :account="account" :prefix="prefix" />
  </Story>
</template>

<script lang="ts" setup>
import IdentityItem from './IdentityItem.vue'

const label = 'Tester'
const account = 'J9nD3s7zssCX7bion1xctAF6xcVexcpy2uwy4jTm9JL8yuK'
const prefix = 'rmrk'
</script>
