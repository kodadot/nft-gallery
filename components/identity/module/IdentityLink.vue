<template>
  <a :href="`https://kusama.subscan.io/account/${address}`">
    {{ shortenedAddress }}
  </a>
</template>

<script lang="ts" setup>
import { GenericAccountId } from '@polkadot/types/generic/AccountId'

type Address = string | GenericAccountId | undefined

defineProps<{
  shortenedAddress?: string | object
  address?: Address
}>()
</script>
