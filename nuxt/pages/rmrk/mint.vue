<template>
  <SimpleMint />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import SimpleMint from '@/components/rmrk/Create/SimpleMint.vue'

@Component({
  components: {
    SimpleMint
  }
})

export default class SimpleMintPage extends Vue {
}
</script>
