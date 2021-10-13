<template>
  <div>
    <slot v-if="isNotEmpty" />
    <div v-else>
      {{ label }} is empty
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class EmptyGuard extends Vue {
    @Prop() public array!: any[];
    @Prop() public label!: string;

    get isNotEmpty() {
      return this.lenghtOf(this.array)
    }

    private lenghtOf(array: any[]) {
      return (array && array.length) || 0
    }


}
</script>

