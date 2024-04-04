<template>
  <p class="text-base">
    {{ $t('codeChecker.usingParamHashMeans') }}
  </p>

  <CodeCheckerIssueHintCodeBlock class="mt-5" :code="code" lang="javascript" />
</template>

<script setup lang="ts">
const code = `
const params = getURLParams()
hash = params.hash || DEFAULT_HASH`
</script>
