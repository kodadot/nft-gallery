<template>
  <p class="text-base">
    {{ $t('codeChecker.validImageMeans') }}
  </p>

  <CodeCheckerIssueHintCodeBlock class="mt-5" :code="code" lang="javascript" />
</template>

<script setup lang="ts">
const code = `
function postMessageKoda() {
  console.log('Talking')
  const canvas = document.querySelector('canvas')
  const message = {
    id: Date.now(),
    type: 'kodahash/render/completed',
    payload: {
      hash: hash,
      type: 'image/png',
      image: canvas ? canvas.toDataURL('image/png') : null,
      search: location.search,
      attributes: [],
    },
  }
  console.log('Sending', message)

  window.parent.postMessage(message, '*')
}`
</script>
