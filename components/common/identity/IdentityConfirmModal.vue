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
          <div
            v-if="imageUrl"
            class="is-flex is-justify-content-center is-align-items-center">
            <div class="image-wrapper is-clipped">
              <img :src="imageUrl" class="w-full" />
            </div>
          </div>

          <template v-for="(value, key, index) in identityFields">
            <div
              v-if="value"
              :key="key"
              class="is-flex is-justify-content-space-between is-align-items-center py-4"
              :class="{ 'is-bordered-top': index !== 0 }">
              <span class="has-text-weight-bold is-size-6 is-capitalized">{{
                $t(key)
              }}</span>
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
            <span class="has-text-weight-bold is-size-5">
              {{ depositFormatted }}</span
            >
          </div>
        </div>

        <NeoButton
          :label="$t('identity.create')"
          variant="k-accent"
          no-shadow
          class="fixed-button-height is-flex is-flex-1"
          @click.native="emit('confirm')" />
      </template>
    </ResponsiveModal>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import ResponsiveModal from '@/components/shared/ResponsiveModal.vue'
import format, { calculateBalance } from '@/utils/format/balance'
import { useFiatStore } from '@/stores/fiat'
import { calculateUsdFromToken } from '@/utils/calculation'
import type { IdentityFields } from '@/composables/useIdentity'

const emit = defineEmits(['confirm', 'close'])

const props = defineProps<{
  value: boolean
  deposit: string
  identity: IdentityFields
  image?: File
  isMobile: boolean
}>()

const { decimals, unit } = useChain()

const isModalActive = useVModel(props, 'value')

const depositFormatted = computed(() =>
  format(props.deposit, decimals.value, unit.value)
)
const currentTokenValue = computed(() => getCurrentTokenValue(unit.value))
const depositUsd = computed(() =>
  calculateUsdFromToken(
    Number(currentTokenValue.value),
    Number(currentTokenValue.value)
  )
)
const identityFields = computed(() => ({
  handle: props.identity.display,
  name: props.identity.legal,
  email: props.identity.email,
  website: props.identity.web,
  riot: props.identity.riot,
  twitter: props.identity.twitter,
}))

const imageUrl = computed(() =>
  props.image ? URL.createObjectURL(props.image) : null
)

const { fetchFiatPrice, getCurrentTokenValue } = useFiatStore()

const onClose = () => {
  emit('close')
}

onMounted(async () => {
  await fetchFiatPrice()
})
</script>

<style lang="scss" scoped>
.image-wrapper {
  border-radius: 100%;

  height: 100px;
  width: 100px;
}
</style>
