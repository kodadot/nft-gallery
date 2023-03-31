<template>
  <div class="redirect-card p-4">
    <div class="redirect-header has-text-weight-bold pb-2 mb-4">
      {{ $t('redirect.title') }}
    </div>
    <div class="mb-4">
      <p class="mb-2">
        {{ $t('redirect.leavingTips') }}
      </p>
      <p class="link mb-2">{{ props.url }}</p>
      <p>
        {{ $t('redirect.safetyTips') }}
      </p>
    </div>
    <div class="is-flex">
      <NeoButton
        class="mr-2"
        no-shadow
        :label="$t('redirect.continue')"
        @click.native="handleRedirect" />
      <NeoButton
        no-shadow
        :label="$t('redirect.stay')"
        variant="k-accent"
        @click.native="emit('close')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['close'])
const props = defineProps<{
  url: string
}>()

const handleRedirect = () => {
  emit('close')
  window.open(props.url, '_blank')
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';
@import '@/styles/abstracts/animations';

.redirect-card {
  box-shadow: var(--card-box-shadow);
  @include ktheme() {
    background: theme('background-color');
  }
  .redirect-header {
    @include ktheme() {
      border-bottom: 1px solid theme('k-grey');
    }
  }
  p.link {
    @include ktheme() {
      color: theme('k-blue');
    }
  }
  button.is-neo {
    flex: 1;
  }
}
</style>

<style lang="scss">
.redirect-modal .modal-content {
  width: auto;
}
</style>
