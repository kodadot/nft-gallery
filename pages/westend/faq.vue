<template>
  <FrequentlyAsked />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FrequentlyAsked from '@/components/common/FrequentlyAsked.vue'

const components = {
  FrequentlyAsked,
}

@Component({ components })
export default class FrequentlyAskedPage extends Vue {}
</script>
