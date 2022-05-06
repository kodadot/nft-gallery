<template>
  <div class="block">
    <a
      href="https://twitter.com/KodaDot"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Twitter">
      <b-icon pack="fab" icon="twitter" :size="iconType" />
    </a>
    <a
      href="https://instagram.com/kodadot.xyz"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram">
      <b-icon pack="fab" icon="instagram" :size="iconType" />
    </a>
    <a
      href="https://discord.gg/u6ymnbz4PR"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discord">
      <b-icon pack="fab" icon="discord" :size="iconType" />
    </a>
    <a href="">
      <b-icon pack="fab" icon="telegram" :size="iconType" />
    </a>
    <a
      href="https://medium.com/kodadot"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Medium">
      <b-icon pack="fab" icon="medium" :size="iconType" />
    </a>
    <a
      href="https://www.youtube.com/channel/UCEULduld5NrqOL49k1KVjoA/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Youtube">
      <b-icon pack="fab" icon="youtube" :size="iconType" />
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class KodadotSocialLinks extends Vue {
  @Prop({ default: 'is-large' }) public iconType!: string
}
</script>
