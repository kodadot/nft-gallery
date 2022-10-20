<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Placeholder extends Vue {
  @Prop() public templateValue!: undefined
  private templateValue2: undefined
}
</script>
