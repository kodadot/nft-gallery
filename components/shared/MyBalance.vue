<template>
  <p class="subtitle is-size-6" v-if="accountId">
    <span>{{ $t('general.balance') }}: </span>
    <Money :value="balance" inline />
  </p>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import AuthMixin from '@/utils/mixins/authMixin'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components })
export default class MyBalance extends mixins(AuthMixin) {
  get balance(): string {
    return this.$store.getters.getAuthBalance
  }
}
</script>
