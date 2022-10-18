<template>
  <component :is="tag" class="label">{{ $t(value) }}</component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Label extends Vue {
  @Prop(String) public value!: string
  @Prop({ type: String, default: 'p' }) public tag!: string
}
</script>
