<template>
  <iframe
    :id="config.iframeId"
    title="render-preview"
    class="sandbox-iframe w-full h-[440px] border"
    sandbox="allow-scripts allow-same-origin"
    :src="iframeSrc"
    @load="onIframeLoad">
  </iframe>
</template>

<script setup lang="ts">
import { AssetMessage, postAssetsToSandbox } from './utils'
import config from './codechecker.config'

const props = defineProps<{
  hash: string
  assets: Array<AssetMessage>
  count: number
}>()

const emit = defineEmits(['update:count'])

const vCount = useVModel(props, 'count', emit)

const iframeSrc = computed(
  () => `/sandbox.html?hash=${props.hash}&count=${vCount.value}`,
)
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
