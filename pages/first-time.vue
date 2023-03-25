<template>
  <section class="content">
    <Markdown
      :source="FirstTimeMD"
      :anchor-attributes="{
        target: '_blank',
        rel: 'noopener noreferrer',
      }" />
  </section>
</template>

<script lang="ts" setup>
import FirstTimeMD from '../FIRST_TIME.md'
</script>
