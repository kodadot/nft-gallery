<template>
  <NeoButton
    style="width: 40px"
    no-shadow
    icon-left="gift"
    :tag="NuxtLink"
    :to="`/${urlPrefix}/transfer?target=${props.address}&usdamount=10&donation=true`">
  </NeoButton>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { resolveComponent } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')
const props = defineProps<{
  address: string
}>()

const { urlPrefix } = usePrefix()
</script>
