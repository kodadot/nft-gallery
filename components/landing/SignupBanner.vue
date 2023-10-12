<template>
  <div class="columns is-multiline">
    <div class="column is-8-desktop is-6-tablet is-12-mobile">
      <div class="columns is-multiline">
        <div
          class="column is-6-desktop is-12-tablet is-12-mobile is-flex is-align-items-center">
          <h3 class="is-size-5 has-text-weight-bold">
            {{ $t('signupBanner.title') }}
          </h3>
          <img src="/signup-voucher.svg" />
        </div>

        <div class="column is-6-desktop is-12-tablet is-12-mobile">
          <span>
            {{ $t('signupBanner.subtitle') }}
          </span>
        </div>
      </div>
    </div>

    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <form class="is-flex" @submit.prevent="submit">
        <NeoField>
          <NeoInput
            v-model="email"
            type="email"
            placeholder="youremail@something"
            required />
        </NeoField>

        <NeoField class="ml-4">
          <NeoButton
            native-type="submit"
            variant="k-accent"
            :loading="loading"
            :disabled="loading"
            no-shadow>
            {{ $t('signupBanner.claimVoucher') }}
          </NeoButton>
        </NeoField>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoField, NeoInput } from '@kodadot1/brick'

const beehiivApi = useBeehiiv()
const email = ref()
const loading = ref(false)

const submit = async () => {
  try {
    loading.value = true
    await beehiivApi.subscribe(email.value)
  } catch (error) {
    loading.value = false
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';
</style>
