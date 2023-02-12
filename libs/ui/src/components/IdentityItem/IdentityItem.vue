<template>
  <div class="is-flex is-align-items-center">
    <Avatar :size="48" :value="account" />
    <div class="p-3">
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
const Identity = defineAsyncComponent(
  () => import('@/components/identity/IdentityIndex.vue')
)
defineProps<{
  label: string
  account: string
  prefix: string
}>()
</script>
