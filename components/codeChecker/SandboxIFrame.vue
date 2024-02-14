<template>
  <iframe
    id="sketch-iframe"
    title="render-preview"
    class="sandbox-iframe w-full h-[440px] border"
    sandbox="allow-scripts allow-same-origin"
    :src="iframeSrc"
    @load="onIframeLoad">
  </iframe>
</template>

<script setup lang="ts">
import { postCodeToIframe } from './utils'

const props = defineProps<{
  hash: string
  code: string
}>()

const iframeSrc = computed(() => `/sandbox.html?hash=${props.hash}`)

watch([() => props.hash, () => props.code], () => {
  postCodeToIframe(props.code)
})

function onIframeLoad() {
  postCodeToIframe(props.code)
}
</script>
