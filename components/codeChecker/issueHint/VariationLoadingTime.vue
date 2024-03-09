<template>
  <p class="text-base">
    {{ $t('codeChecker.variationLoadingTimeMeans1') }}
  </p>

  <ul class="list-disc mt-4">
    <li>{{ $t('codeChecker.variationLoadingTimeMeans2') }}</li>
    <li>{{ $t('codeChecker.variationLoadingTimeMeans3') }}</li>
  </ul>

  <CodeCheckerIssueHintCodeBlock class="mt-5" :code="code" lang="javascript" />
</template>

<script setup lang="ts">
const code = `
function windowResized() {  canvasSize = min(windowWidth, windowHeight)
  resizeCanvas(canvasSize, canvasSize)
}`
</script>
