<template>
  <section>
    <form @submit.prevent>
      <h1 class="title is-size-3 mb-8">
        {{ $i18n.t('identity.set', ['asd']) }}
        <!-- <NeoTooltip
          :label="$i18n.t('identity.fundsReserve')"
          position="bottom"
          multiline>
          <NeoIcon icon="info-circle" pack="fas" />
        </NeoTooltip> -->
      </h1>

      <!-- <p v-if="accountId" class="subtitle is-size-6">
        <Auth />
        <span>{{ $i18n.t('general.balance') }}: </span>
        <Money :value="balance" inline />
      </p> -->

      <div class="is-flex is-justify-content-center">
        <DragDrop
          v-model="identity.image"
          rounded
          expanded
          class="avatar-upload"
          full-preview
          accept="image/*"
          @fileSelected="handleImageSelect">
          <template #drop> + </template>
        </DragDrop>
      </div>

      <NeoField :label="`${$i18n.t('handle')} *`" class="mb-5">
        <NeoInput
          v-model="identity.display"
          :placeholder="$i18n.t('identity.onChainPlaceholder')"
          :maxlength="inputLengthLimit"
          required
          :validation-message="$i18n.t('identity.handleRequired')" />
      </NeoField>

      <BasicInput
        v-model="identity.legal"
        class="mb-4"
        :label="$i18n.t('name')"
        :maxlength="inputLengthLimit"
        :placeholder="$i18n.t('identity.namePlaceholder')"
        expanded />

      <BasicInput
        v-model="identity.email"
        type="email"
        class="mb-5"
        :maxlength="inputLengthLimit"
        :label="$i18n.t('email')"
        placeholder="somebody@example.com"
        expanded />

      <BasicInput
        v-model="identity.web"
        class="mb-4"
        :label="$i18n.t('website')"
        :maxlength="inputLengthLimit"
        placeholder="https://example.com"
        expanded />

      <NeoField label="Any Socials?" class="mb-5">
        <div class="is-flex is-flex-direction-column">
          <p>{{ $t('identity.socialsDescription') }}</p>

          <PillTabs
            class="mt-4"
            :tabs="socialTabs"
            @select="handleSocialSelect" />
        </div>
      </NeoField>

      <Transition name="fade">
        <BasicInput
          v-if="showTab(Social.Twitter)"
          v-model="identity.twitter"
          class="mb-4"
          label="Twitter"
          :maxlength="inputLengthLimit"
          placeholder="@YourTwitterName"
          expanded />
      </Transition>

      <Transition name="fade">
        <BasicInput
          v-if="showTab(Social.Riot)"
          v-model="identity.riot"
          class="mb-4"
          label="Riot"
          :maxlength="inputLengthLimit"
          placeholder="@yourname:matrix.org"
          expanded />
      </Transition>

      <hr />

      <p class="subtitle is-size-6">
        {{ $i18n.t('identity.deposit') }}
        <Money :value="deposit" inline />
      </p>

      <NeoButton
        class="fixed-button-height is-flex is-flex-1"
        variant="k-accent"
        size="medium"
        :label="$t('identity.create')"
        :disabled="disabled"
        :loading="isLoading"
        expanded
        @click.native="openConfirmModal" />
    </form>

    <IdentityConfirmModal
      v-model="isConfirmModalActive"
      :deposit="deposit"
      :identity="identity"
      :image="image"
      :is-mobile="isMobile"
      @confirm="submit"
      @close="isConfirmModalActive = false" />

    <TransactionLoader
      v-model="isLoaderModalVisible"
      :status="status"
      :total-token-amount="0"
      :transaction-id="transactionValue"
      :total-usd-value="0"
      :is-mobile="isMobile"
      @close="isLoaderModalVisible = false" />
  </section>
</template>

<script lang="ts" setup>
import { notificationTypes, showNotification } from '@/utils/notification'
import { NeoButton, NeoField, NeoInput } from '@kodadot1/brick'
import type { IdentityFields } from '@/composables/useIdentity'
import DragDrop from '@/components/shared/DragDrop.vue'
import PillTabs, { PillTab } from '@/components/shared/PillTabs.vue'
import IdentityConfirmModal from '@/components/common/identity/IdentityConfirmModal.vue'
import TransactionLoader from '@/components/shared/TransactionLoader.vue'

enum Social {
  Riot = 'riot',
  Twitter = 'twitter',
}

const { howAboutToExecute, isLoading, initTransactionLoader, status } =
  useMetaTransaction()
const isMobile = computed(() => useWindowSize().width.value <= 764)

const image = ref<File>()
const isConfirmModalActive = ref(false)
const isLoaderModalVisible = ref(false)
const transactionValue = ref('')

watch(isLoading, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    isLoaderModalVisible.value = isLoading.value
  }
})

const socialTabs = ref<PillTab[]>([
  {
    label: 'Riot',
    icon: { name: 'fa-discord', pack: 'fa-brands' },
    value: Social.Riot,
  },
  {
    label: 'Twitter',
    icon: { name: 'fa-x-twitter', pack: 'fa-brands' },
    value: Social.Twitter,
  },
])

const showTab = (value: Social) => {
  return socialTabs.value.find((tab) => tab.value === value)?.active
}

const openConfirmModal = () => {
  isConfirmModalActive.value = true
}

const handleImageSelect = (file: File) => {
  image.value = file
}

const submit = async (): Promise<void> => {
  isConfirmModalActive.value = false
  const api = await apiInstance.value
  initTransactionLoader()
  const cb = api.tx.identity.setIdentity
  const args = [enhanceIdentityData()]
  howAboutToExecute(accountId.value, cb, args, onSuccess)
}

const BasicInput = defineAsyncComponent(
  () => import('@/components/shared/form/BasicInput.vue')
)
const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)

const { $i18n } = useNuxtApp()
import { useIdentityStore } from '@/stores/identity'

const { apiInstance } = useApi()
const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const identityStore = useIdentityStore()

const identity = ref<IdentityFields>({})
const deposit = ref('0')
const inputLengthLimit = ref(32)

const { identity: identityData } = useIdentity({
  address: accountId,
})

watch(identityData, () => {
  const { display, legal, web, twitter, riot, email, image } =
    identityData.value
  identity.value = {
    display,
    legal,
    web,
    twitter,
    riot,
    email,
    image,
  }
})

const handleUrlPrefixChange = async () => {
  deposit.value = await fetchDeposit()

  if (Number(identityStore.getAuthBalance) === 0) {
    identityStore.fetchBalance({ address: accountId.value })
  }
}

const enhanceIdentityData = (): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(identity.value)
      .filter(([, val]) => !!val)
      .map(([key, val]: [string, string]) => {
        if (val) {
          return [key, { raw: val }]
        }
        return [key, { none: null }]
      })
  )
}

const fetchDeposit = async () => {
  const api = await apiInstance.value
  return api.consts.identity?.basicDeposit?.toString()
}

const onSuccess = (block: string) => {
  showNotification(
    `[Identity] You are known as ${identity.value.display} since block ${block}`,
    notificationTypes.success
  )
}

const handleSocialSelect = (value: string) => {
  socialTabs.value = socialTabs.value.map((tab) => {
    if (tab.value !== value) {
      return tab
    }
    return { ...tab, active: !tab.active }
  })
}

const disabled = computed(
  () => Object.values(identity.value).filter((val) => val).length === 0
)

watch(
  urlPrefix,
  async () => {
    accountId.value && handleUrlPrefixChange()
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.avatar-upload {
  height: 200px;
  width: 200px;
}
</style>
