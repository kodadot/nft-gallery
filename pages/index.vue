<template>
  <Landing :prefix="urlPrefix" :build-on="buildOnText" />
</template>

<script lang="ts" setup>
import Landing from '@/components/landing/LandingPage.vue'
import { prefixBuildOnText } from '@/utils/prefix'

const { urlPrefix } = usePrefix()
const buildOnText = computed(() => prefixBuildOnText(urlPrefix.value))
</script>
