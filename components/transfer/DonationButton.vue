<template>
  <NeoButton
    style="width: 40px"
    no-shadow
    icon-left="gift"
    icon-pack="fas"
    @click.native="goToTransfer">
  </NeoButton>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

const props = defineProps<{
  address: string
}>()

const { $router } = useNuxtApp()

function goToTransfer() {
  $router.push({
    name: 'transfer',
    query: { target: props.address, usdamount: '10', donation: 'true' },
  })
}
</script>
