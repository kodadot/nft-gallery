<template>
  <h1 class="section-title__main">
    {{ title }}
  </h1>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class SectionTitle extends Vue {
  @Prop(String) public title!: string;
}
</script>

<style scoped>
.section-title__main {
  font-size: x-large;
  margin: 0.5em;
}
</style>

