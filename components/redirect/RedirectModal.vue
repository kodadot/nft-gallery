<template>
  <div class="redirect-card p-4">
    <div class="redirect-header font-bold pb-2 mb-4">
      {{ props.i18n.t('redirect.title') }}
    </div>
    <div class="mb-4">
      <p class="mb-2">
        {{ props.i18n.t('redirect.leavingTips') }}
      </p>
      <p class="link mb-2">
        {{ props.url }}
      </p>
      <p>
        {{ props.i18n.t('redirect.safetyTips') }}
      </p>
    </div>
    <div class="flex">
      <NeoButton
        class="mr-2"
        no-shadow
        :label="props.i18n.t('redirect.continue')"
        @click="handleRedirect"
      />
      <NeoButton
        no-shadow
        :label="props.i18n.t('redirect.stay')"
        variant="primary"
        @click="emit('close')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import type VueI18n from 'vue-i18n/types'

const emit = defineEmits(['close'])
const props = defineProps<{
  url: string
  i18n: VueI18n
}>()

const handleRedirect = () => {
  emit('close')
  window.open(props.url, '_blank')
}
</script>

<style scoped>
@reference '@/assets/css/tailwind.css';

.redirect-card {
  box-shadow: var(--card-box-shadow);
  background: var(--background-color);
  .redirect-header {
    @apply border-b border-k-grey;
  }
  p.link {
    word-break: break-all;
    color: var(--k-blue);
  }
  button.is-neo {
    flex: 1;
  }
}
</style>
