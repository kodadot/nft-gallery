<template>
  <p class="text-base">
    {{ $t('codeChecker.correctHTMLNameMeans') }}
  </p>

  <CodeCheckerIssueHintCodeBlock class="mt-5" :code="code" lang="markup" />
</template>

<script setup lang="ts">
const code = `
<!DOCTYPE html>
<html>
  <head>
    <title>artwork name goes here</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="./style.css">
    <script src="./p5.min.js"><\/script>
  </head>
  <body>
    <script src="./sketch.js"><\/script>
</body>
</html>
`
</script>

<style scoped>
.tag {
  color: #fff;
  background-color: #000;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}
</style>
