<template>
  <div class="emotion modal-card">
    <div class="modal-card-head">
      <p class="modal-card-title">See who reacted...</p>
      <button type="button" class="delete" @click="$emit('close')" />
    </div>

    <div class="modal-card-body">
      <div
        v-for="emote in emotes.slice(0, DISPLAYED_EMOJI)"
        :key="emote.key"
        class="emotes">
        <div class="emotes-icon">{{ emote.parsed }}</div>
        <div>
          <p>{{ emote.count }} person reacted to this NFT:</p>
          <div
            v-for="issuer in emote.issuers"
            :key="issuer"
            @click="$emit('close')">
            <ProfileLink :address="issuer" />
          </div>
        </div>
      </div>

      <b-button
        v-if="emotes.length > DISPLAYED_EMOJI"
        class="mt-4"
        expanded
        @click="showAllEmotes()"
        >Load More</b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Provide, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  },
})
export default class EmotionModal extends Vue {
  @Prop() emotes!: string[]
  @Provide() DISPLAYED_EMOJI = 10

  showAllEmotes() {
    this.DISPLAYED_EMOJI = this.emotes.length
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.emotion {
  max-width: 400px;
  border: 2px solid $primary;

  &.modal-card {
    background: $frosted-glass-background;
    backdrop-filter: $frosted-glass-light-backdrop-filter;
  }

  .modal-card-body,
  .modal-card-head {
    background: unset;
  }

  .buttons button {
    border-radius: 0;
    justify-content: space-between;
  }
}

.emotes {
  display: flex;

  & + & {
    margin-top: 1rem;
  }

  &-icon {
    font-size: 2rem;
    margin-right: 1rem;
  }
}
</style>
