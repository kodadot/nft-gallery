<template>
  <div id="custom-substack-embed" data-testid="footer-subscribe"></div>
</template>

<script lang="ts" setup>
const substackScript = ref<HTMLScriptElement | null>(null)

onMounted(() => {
  substackScript.value = document.createElement('script')

  const script = substackScript.value

  const substackWidgetParams = {
    substackUrl: 'kodadot.substack.com',
    placeholder: 'jane.doe@kodadot.xyz',
    theme: 'custom',
    colors: {
      primary: '#FF7AC3',
      input: '#FFFFFF',
      email: '#000000',
      text: '#000000',
    },
  } as const

  const w = window as typeof window & {
    CustomSubstackWidget: typeof substackWidgetParams
  }

  w.CustomSubstackWidget = substackWidgetParams

  script.setAttribute('src', 'https://substackapi.com/widget.js')
  script.setAttribute('async', 'true')
  document.head.append(script)
})

onUnmounted(() => {
  substackScript.value?.remove()
})
</script>
