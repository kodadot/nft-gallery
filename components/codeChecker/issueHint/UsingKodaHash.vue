<template>
  <i18n-t tag="p" class="text-base" keypath="codeChecker.usingKodaHashMeans">
    <template #link>
      <a
        href="https://github.com/vikiival/kodahash"
        target="_blank"
        rel="noopener noreferrer"
        class="text-k-blue hover:text-k-blue-hover">
        {{ $t('codeChecker.kodahashTemplate') }}
      </a>
    </template>
  </i18n-t>

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
