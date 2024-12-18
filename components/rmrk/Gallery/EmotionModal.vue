<template>
  <div class="emotion modal-card">
    <div class="modal-card-head">
      <p class="modal-card-title">
        See who reacted...
      </p>
      <button
        type="button"
        class="delete"
        @click="$emit('close')"
      />
    </div>

    <div class="modal-card-body">
      <div
        v-for="emote in emotes.slice(0, DISPLAYED_EMOJI)"
        :key="emote.key"
        class="emotes"
      >
        <div class="emotes-icon">
          {{ emote.parsed }}
        </div>
        <div>
          <p>{{ emote.count }} person reacted to this NFT:</p>
          <div
            v-for="issuer in emote.issuers"
            :key="issuer"
            @click="$emit('close')"
          >
            <ProfileLink :address="issuer" />
          </div>
        </div>
      </div>

      <NeoButton
        v-if="emotes.length > DISPLAYED_EMOJI"
        class="mt-4"
        no-shadow
        expanded
        @click="showAllEmotes()"
      >
        Load More
      </NeoButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import ProfileLink from '@/components/profile/ProfileLink.vue'

const props = defineProps<{
  emotes: string[]
}>()

const DISPLAYED_EMOJI = ref(10)

const showAllEmotes = () => {
  DISPLAYED_EMOJI.value = props.emotes.length
}
</script>
