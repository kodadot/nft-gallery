<template>
  <div class="is-flex is-align-items-center mr-6">
    <Avatar :size="48" :value="account" class="mr-2" />
    <div class="px-3">
      <div class="has-text-grey is-size-6">
        {{ label }}
      </div>
      <nuxt-link
        class="has-text-weight-bold"
        :to="{
          name: `${prefix}-u-id`,
          params: { id: account },
        }">
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
