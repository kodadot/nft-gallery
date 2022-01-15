<template>
  <audio width="400" controls>
      <source :src="src" :type="mimeType">
      Unable to show audio
  </audio>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class AppAudio extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
}
</script>
