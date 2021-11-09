<template>
  <div>
    <label><b>{{ label }}</b></label>
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'WithLabel'
})
export default class WithLabel extends Vue {
  @Prop(String) readonly label: string | undefined;
}

</script>
