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
              'text-k-grey': section === 'review',
              'has-text-color': section === 'sign',
            }" />
          <span
            :class="{
              'text-k-grey': section === 'review',
              'has-text-weight-bold': section === 'sign',
            }">
            {{ $t('migrate.sign') }}
          </span>
        </h1>

        <hr />

        <div
          v-if="accountId"
          class="rounded-full border border-k-shade flex justify-start flex-grow pl-3">
          <IdentityItem
            :label="$t('confirmPurchase.connectedWith')"
            hide-identity-popover
            disable-identity-link
            :prefix="urlPrefix"
            :account="accountId"
            class="identity-name-font-weight-regular"
            data-testid="item-creator" />
        </div>
        <div v-else>
          <div class="flex items-center">
            <p class="mr-4">{{ $t('migrate.connect') }}</p>
            <ConnectWalletButton no-shadow variant="k-accent" />
          </div>
          <hr />
        </div>

        <MigrateStepsReview v-if="section === 'review'" />
        <MigrateStepsSign v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import IdentityItem from '@/components/identity/IdentityItem.vue'
import MigrateModal from '@/components/migrate/MigrateModal.vue'

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { neoModal } = useProgrammatic()
const route = useRoute()

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

onBeforeMount(() => {
  if (
    !route.query.collectionId ||
    !route.query.source ||
    !route.query.destination
  ) {
    navigateTo('/migrate')
  }
})
</script>
