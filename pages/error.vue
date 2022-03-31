<template>
  <ErrorMsg />
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// due to the name conflict, has to import and rename it
import ErrorMsg from '@/components/shared/Error.vue'

@Component({
  components: { ErrorMsg },
})
export default class Error extends Vue {}
</script>
