<template>
  <div id="custom-substack-embed" data-testid="footer-subscribe"></div>
</template>

<script lang="ts" setup>
useHead({
  script: [{ src: 'https://substackapi.com/widget.js', async: true }],
})

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
</script>
