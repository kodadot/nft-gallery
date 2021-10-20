<template>
  <Partnership />
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator'
import Partnership from '@/components/landing/Partnership.vue'

@Component({
  components: {
    Partnership
  }
})

export default class PartnershipPage extends Vue {
}
</script>
