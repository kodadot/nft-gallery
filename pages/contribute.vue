<template>
  <section class="content">
    <Markdown
      :source="Contributing"
      :anchor-attributes="{
        target: '_blank',
        rel: 'noopener noreferrer',
      }" />
  </section>
</template>

<script lang="ts" setup>
import Contributing from '../CONTRIBUTING.md'
</script>
