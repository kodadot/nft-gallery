<template>
  <div>
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
        <div>
          <template v-for="(value, key, index) in identityFields">
            <div
              v-if="value"
              :key="key"
              class="is-flex is-justify-content-space-between is-align-items-center py-4"
              :class="{ 'is-bordered-top': index !== 0 }">
              <span class="has-text-weight-bold is-size-6 is-capitalized">
                <NeoIcon
                  v-if="getIcon(key)"
                  class="mr-1"
                  :icon="getIcon(key)?.name"
                  :pack="getIcon(key)?.pack" />

                {{ $t(key) }}</span
              >
              <span class="is-flex is-align-items-center">
                <span class="ml-2 is-size-6">
                  {{ value }}
                </span>
              </span>
            </div>
          </template>
        </div>
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
  </div>
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

const getIcon = (key: string) => {
  return props.socials.find((social) => social.value === key)?.icon
}

const onClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.image-wrapper {
  border-radius: 100%;

  height: 100px;
  width: 100px;
}
</style>
