<template>
  <ViewModel />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ViewModel from '@/components/rmrk/Gallery/ViewModel.vue'

@Component({
  components: {
    ViewModel,
  },
})
export default class ViewPage extends Vue {}
</script>
