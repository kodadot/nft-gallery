<template>
  <RampCredit />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import RampCredit from '@/components/common/RampCredit.vue'

const components = {
  RampCredit,
}

@Component({ components })
export default class Credit extends Vue {}
</script>
