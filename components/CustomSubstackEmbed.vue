<template>
  <div id="custom-substack-embed" data-testid="footer-subscribe"></div>
</template>

<script lang="ts" setup>
const substackScript = document.createElement('script')

window.CustomSubstackWidget = {
  substackUrl: 'kodadot.substack.com',
  placeholder: 'jane.doe@kodadot.xyz',
  theme: 'custom',
  colors: {
    primary: '#FF7AC3',
    input: '#FFFFFF',
    email: '#000000',
    text: '#000000',
  },
}

onMounted(() => {
  substackScript.src = 'https://substackapi.com/widget.js'
  substackScript.async = true
  document.head.append(substackScript)
})

onUnmounted(() => {
  substackScript?.remove()
})
</script>
