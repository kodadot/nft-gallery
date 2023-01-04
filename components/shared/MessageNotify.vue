<template>
  <div v-if="showMessageBox">
    <b-message class="message-box" :duration="10000" auto-close>
      <img src="/congrats-message-header.svg" class="congrats-message" />
      <div class="is-flex is-flex-direction-column">
        <div class="is-four-fifths mb-4">
          <p class="title is-3">
            {{ title }}
          </p>
        </div>
        <div
          class="subtitle-box is-flex is-align-items-center is-justify-content-space-between pt-2">
          <span class="subtitle is-size-5 subtitle-text-congrats">
            {{ subtitle }}
          </span>
          <Sharing
            btn-type="is-primary"
            :enable-download="enableDownload"
            is-primary="{true}" />
        </div>
      </div>
    </b-message>
  </div>
</template>

<script lang="ts" setup>
const Sharing = defineAsyncComponent(
  () => import('@/components/shared/Sharing.vue')
)

const showMessageBox = ref(true)

defineProps<{
  title?: string
  subtitle?: string
  enableDownload: false
}>()
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.message-box {
  max-width: 480px;
  background-color: $white;
  border: 1px solid $dark-accent;
  box-shadow: $primary-shadow;
  border-radius: 0;
  position: absolute;
  left: 0;
  z-index: 1;

  .message-body {
    border: none;
  }

  .subtitle-text-congrats {
    margin-bottom: 0;
  }

  .subtitle-box {
    border-top: 1px solid $k-grey;
  }

  .congrats-message {
    filter: drop-shadow(4px 4px 0px rgb(0 0 0 / 1));
  }
}

.dark-mode .message-box {
  background-color: $dark-accent;
  border: 1px solid $white;
  box-shadow: $primary-shadow-dark;
}
</style>
