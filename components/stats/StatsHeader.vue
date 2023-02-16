<template>
  <div class="columns">
    <div class="column is-four-fifths">
      <h1 class="title is-2">{{ title }}</h1>
      <p class="subtitle is-size-5">{{ subtitle }}</p>
    </div>
    <div class="column">
      <img
        src="~/assets/rmrk-logo-pink-faded.png"
        alt="RMRK"
        class="chain-logo is-hidden-mobile" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  subtitle: string
}>()
</script>
