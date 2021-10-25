<template>
  <Series />
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator'
import Series from '@/components/landing/Series.vue'

@Component({
  components: {
    Series
  }
})

export default class SeriesPage extends Vue {
}
</script>
