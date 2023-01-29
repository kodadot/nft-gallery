<template>
  <div v-if="showMessageBox">
    <b-message class="message-box" duration="10000" auto-close>
      <img src="/congrats-message-header.svg" class="congrats-message" />
      <div class="is-flex is-flex-direction-column">
        <div class="title is-3 mb-4">
          {{ title }}
        </div>
        <hr class="my-2" />
        <div
          class="is-flex is-align-items-center is-justify-content-space-between">
          <span class="subtitle is-6 mb-0">
            {{ subtitle }}
          </span>
          <Sharing btn-type="is-primary" :enable-download="enableDownload" />
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
  z-index: 10;
  max-width: 500px;
  position: absolute;
  border-radius: 0;
  top: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;

  @include ktheme() {
    box-shadow: theme('primary-shadow');
    background-color: theme('background-color');
    border: 1px solid theme('text-color');
  }

  .message-body {
    border: none;
  }

  .congrats-message {
    filter: drop-shadow(4px 4px 0px rgb(0 0 0 / 1));
  }
}
</style>
