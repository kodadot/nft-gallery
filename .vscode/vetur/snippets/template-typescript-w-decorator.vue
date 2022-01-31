<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  @Prop() public templateValue!: undefined
  private templateValue2: undefined
}
</script>
