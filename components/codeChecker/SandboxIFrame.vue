<template>
  <NeoIFrameMedia
    :key="count"
    :class="['sandbox-iframe', customClass]"
    :iframe-id="config.iframeId"
    :src="iframeSrc"
    sandbox="allow-scripts allow-same-origin"
    title="render-preview"
    allow=""
    @load="onIframeLoad" />
</template>

<script setup lang="ts">
import { NeoIFrameMedia } from '@kodadot1/brick'
import { postAssetsToSandbox } from './utils'
import config from './codechecker.config'
import { AssetMessage } from './types'

const props = defineProps<{
  hash: string
  assets: Array<AssetMessage>
  count: number
  customClass?: string | object
}>()

const emit = defineEmits(['update:count'])

const vCount = useVModel(props, 'count', emit)

const iframeSrc = computed(() => `/sandbox.html?hash=${props.hash}`)
watch(
  () => props.assets,
  () => {
    // force update iframe
    vCount.value++
  },
  { deep: true },
)

function onIframeLoad() {
  postAssetsToSandbox(props.assets)
}
</script>
