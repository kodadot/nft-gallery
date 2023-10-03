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

      <NeoButton
        v-if="emotes.length > DISPLAYED_EMOJI"
        class="mt-4"
        no-shadow
        expanded
        @click.native="showAllEmotes()">
        Load More
      </NeoButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProfileLink from '@/components/profile/ProfileLink.vue'
import { NeoButton } from '@kodadot1/brick'

const props = defineProps<{
  emotes: string[]
}>()

const DISPLAYED_EMOJI = ref(10)

const showAllEmotes = () => {
  DISPLAYED_EMOJI.value = props.emotes.length
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
