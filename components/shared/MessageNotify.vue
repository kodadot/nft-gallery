<template>
  <div>
    <b-message class="message-box" type="is-primary">
      <div class="columns">
        <div class="column is-four-fifths">
          <p class="title is-3 has-text-white">
            {{ title }}
          </p>
          <p class="subtitle is-size-5 subtitle-text has-text-white">
            {{ subtitle }}
          </p>
        </div>
        <div class="column">
          <Sharing
            btn-type="is-primary"
            :enable-download="enableDownload"
            is-primary="{true}" />
        </div>
      </div>
    </b-message>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component<MessageNotify>({
  components: {
    Sharing: () => import('@/components/shared/Sharing.vue'),
  },
})
export default class MessageNotify extends Vue {
  @Prop() public title!: string
  @Prop() public subtitle!: string
  @Prop({ default: false }) public enableDownload?: boolean
}
</script>
