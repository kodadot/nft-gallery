<template>
  <p class="text-base">
    {{ $t('codeChecker.notUsingWebGlMeans') }}
  </p>

  <CodeCheckerIssueHintCodeBlock class="mt-5" :code="code" lang="javascript" />
</template>

<script setup lang="ts">
const code = `
  canvasSize = min(windowWidth, windowHeight)

  createCanvas(canvasSize, canvasSize)

  createGraphics(canvasSize, canvasSize)
  `
</script>
