<template>
  <span v-if="!hasBlockUrl"> {{ text }}</span>
  <a
    v-else
    v-safe-href="blockUrl"
    target="_blank"
    rel="nofollow noopener noreferrer">
    {{ text }}
  </a>
</template>

<script lang="ts" setup>
import { blockExplorerOf } from '@/utils/config/chain.config'

const { urlPrefix } = usePrefix()

const props = withDefaults(
  defineProps<{
    provider?: string
    blockId: string
    text: string
  }>(),
  {
    provider: 'subscan',
  },
)

const blockExplorer = computed(() => blockExplorerOf(urlPrefix.value))
const hasBlockUrl = computed(() => Boolean(blockExplorer.value))

const blockUrl = computed(() => {
  if (!hasBlockUrl.value || !props.blockId) {
    return '#'
  }

  return blockExplorer.value + 'block/' + props.blockId
})
</script>
