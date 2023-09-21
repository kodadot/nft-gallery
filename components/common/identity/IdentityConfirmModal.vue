<template>
  <ResponsiveModal
    v-model="isModalActive"
    :is-mobile="isMobile"
    @close="onClose">
    <template #header>
      <span class="is-size-5 has-text-weight-bold">
        {{ $t('identity.create') }}
      </span>
    </template>

    <template #body>
      <template v-for="(value, key, index) in identityFields">
        <div
          v-if="showField(key)"
          :key="key"
          class="is-flex is-justify-content-space-between is-align-items-center py-4"
          :class="{ 'border-top-k-shade': index !== 0 }">
          <span
            class="has-text-weight-bold is-size-6 is-capitalized is-flex is-justify-content-center">
            <NeoIcon
              v-if="isActiveSocial(key) && getIcon(key)"
              class="mr-2"
              :icon="getIcon(key)?.name"
              :pack="getIcon(key)?.pack" />
            <span>{{ $t(key) }}</span>
          </span>
          <span class="is-flex is-align-items-center">
            <span class="ml-2 is-size-6">
              {{ value || '--' }}
            </span>
          </span>
        </div>
      </template>
    </template>

    <template #footer>
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-3">
        <span class="has-text-weight-bold is-size-6">{{
          $t('identity.deposit')
        }}</span>
        <div class="is-flex is-align-items-center">
          <span class="has-text-grey mr-1 is-size-7">({{ depositUsd }})</span>
          <span class="has-text-weight-bold is-size-5"> {{ deposit }}</span>
        </div>
      </div>

      <NeoButton
        :label="$t('identity.create')"
        variant="k-accent"
        class="fixed-button-height is-flex is-flex-1"
        @click.native="emit('confirm')" />
    </template>
  </ResponsiveModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import ResponsiveModal from '@/components/shared/ResponsiveModal.vue'
import type { IdentityFields } from '@/composables/useIdentity'
import { PillTab } from '@/components/shared/PillTabs.vue'

const emit = defineEmits(['confirm', 'close'])

const props = defineProps<{
  value: boolean
  deposit: string
  depositUsd: string
  identity: IdentityFields
  isMobile: boolean
  socials: PillTab[]
}>()

const isModalActive = useVModel(props, 'value')

const identityFields = computed(() => ({
  handle: props.identity.display,
  name: props.identity.legal,
  email: props.identity.email,
  website: props.identity.web,
  riot: props.identity.riot,
  twitter: props.identity.twitter,
}))

const getSocial = (key: string) =>
  props.socials.find((social) => social.value === key)

const isActiveSocial = (key: string) => getSocial(key)?.active

const getIcon = (key: string) => getSocial(key)?.icon

const showField = (key: string) => {
  const social = getSocial(key)

  if (social) {
    return social.active
  }

  return true
}

const onClose = () => {
  emit('close')
}
</script>
