<template>
  <p class="text-base">
    {{ $t('codeChecker.automaticResizeMeans') }}
  </p>

  <CodeCheckerIssueHintCodeBlock class="mt-5" :code="code" lang="javascript" />
</template>

<script setup lang="ts">
const code = `
function windowResized() {
  canvasSize = min(windowWidth, windowHeight)
  resizeCanvas(canvasSize, canvasSize)
}`
</script>
