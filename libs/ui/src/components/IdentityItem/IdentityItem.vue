<template>
  <div class="is-flex is-align-items-center">
    <Avatar :size="48" :value="account" />
    <div v-if="variant === 'button'" class="identity-item-button pl-3">
      <div class="has-text-weight-bold identity-item-button-label">
        {{ label }}
      </div>
      <NeoButton
        no-shadow
        rounded
        class="mt-1"
        tag="nuxt-link"
        size="small"
        :to="`/${prefix}/u/${account}`"
        >{{ buttonLabel }}</NeoButton
      >
    </div>
    <div v-else class="p-3">
      <div class="has-text-grey is-size-6">
        {{ label }}
      </div>
      <nuxt-link
        class="identity-name has-text-weight-bold"
        :to="`/${prefix}/u/${account}`">
        <Identity :address="account" />
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import NeoButton from '../NeoButton/NeoButton.vue'

const Identity = defineAsyncComponent(
  () => import('@/components/identity/IdentityIndex.vue')
)

withDefaults(
  defineProps<{
    label: string
    account: string
    prefix: string
    variant?: 'normal' | 'button'
    buttonLabel?: string
  }>(),
  {
    variant: 'normal',
    buttonLabel: 'View Profile',
  }
)
</script>

<style lang="scss" scoped>
.identity-item-button {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 3rem;

  &-label {
    line-height: 1;
  }
}
</style>
