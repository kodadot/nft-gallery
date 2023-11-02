<template>
  <ClientOnly>
    <div id="custom-substack-embed" data-testid="footer-subscribe"></div>
  </ClientOnly>
</template>

<script lang="ts" setup>
onMounted(() => {
  const plugin = document.createElement('script')
  plugin.setAttribute('src', 'https://substackapi.com/widget.js')
  plugin.async = true
  document.head.appendChild(plugin)
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
})
</script>
