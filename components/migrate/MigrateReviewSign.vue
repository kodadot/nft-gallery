<template>
  <div>
    <NeoButton variant="pill" @click="promptModal()">
      <NeoIcon icon="arrow-left" class="mr-2" />
      {{ $t('migrate.homeButton') }}
    </NeoButton>

    <div class="mt-8 is-centered columns">
      <div class="is-5-widescreen column">
        <h1 class="is-size-4">
          <span
            :class="{
              'has-text-weight-bold': section === 'review',
            }">
            {{ $t('migrate.review') }}
          </span>
          <NeoIcon
            icon="dash"
            class="mx-4"
            :class="{
              'has-text-grey': section === 'review',
              'has-text-black': section === 'sign',
            }" />
          <span
            :class="{
              'has-text-grey': section === 'review',
              'has-text-weight-bold': section === 'sign',
            }">
            {{ $t('migrate.sign') }}
          </span>
        </h1>

        <hr />

        <div
          class="rounded shade-border-color is-flex is-justify-content-start is-flex-grow-1 pl-3">
          <IdentityItem
            :label="$t('confirmPurchase.connectedWith')"
            hide-identity-popover
            disable-identity-link
            :prefix="urlPrefix"
            :account="accountId"
            class="identity-name-font-weight-regular"
            data-testid="item-creator" />
        </div>

        <MigrateReview v-if="section === 'review'" />
        <MigrateSign v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import IdentityItem from '@/components/identity/IdentityItem.vue'
import MigrateModal from '@/components/migrate/MigrateModal.vue'
import MigrateReview from '@/components/migrate/MigrateReviewSign/MigrateReview.vue'
import MigrateSign from '@/components/migrate/MigrateReviewSign/MigrateSign.vue'

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { neoModal } = useProgrammatic()

defineProps<{
  section: 'review' | 'sign'
}>()

const promptModal = async () => {
  const instance = neoModal.open({
    component: MigrateModal,
    contentClass: 'k-shadow border theme-background-color',
    trapFocus: true,
  })
  const result: boolean = await instance.promise

  if (result && typeof result === 'boolean') {
    navigateTo('/migrate')
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.rounded {
  border-radius: 10rem;
}

.shade-border-color {
  @include ktheme() {
    border: 1px solid theme('k-shade');
  }
}
</style>
