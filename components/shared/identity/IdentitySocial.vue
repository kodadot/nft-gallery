<template>
  <div>
    <a
      v-if="showTwitter && twitter"
      :href="`https://twitter.com/${twitter}`"
      class="twitter-link"
      target="_blank"
      rel="noopener noreferrer">
      <b-icon pack="fab" icon="twitter" />
      <span class="aligned">
        {{ twitter }}
      </span>
    </a>

    <div v-if="showDiscord && discord" class="is-flex is-align-items-center">
      <b-icon pack="fab" icon="discord" />
      <span class="aligned ml-2">
        {{ discord }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class IdentitySocial extends Vue {
  @Prop({ required: true, default: false }) readonly twitter
  @Prop({ required: true, default: false }) readonly showTwitter
  @Prop({ required: true, default: false }) readonly discord
  @Prop({ required: true, default: false }) readonly showDiscord
}
</script>
