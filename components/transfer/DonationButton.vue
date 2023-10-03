<template>
  <NeoButton
    style="width: 40px"
    no-shadow
    icon-left="gift"
    tag="nuxt-link"
    :to="`/${urlPrefix}/transfer?target=${props.address}&usdamount=10&donation=true`">
  </NeoButton>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

const props = defineProps<{
  address: string
}>()

const { urlPrefix } = usePrefix()
</script>
