<template>
  <section>
    <Loader v-model="isLoading" :status="status" />
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
          full-preview>
          <template #drop> + </template>
        </DragDrop>
      </div>

      <NeoField label="Handle *" class="mb-5">
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
        :label="$i18n.t('Email')"
        placeholder="somebody@example.com"
        expanded />

      <BasicInput
        v-model="identity.web"
        class="mb-4"
        label="Website"
        :maxlength="inputLengthLimit"
        placeholder="https://example.com"
        expanded />

      <NeoField label="Any Socials?" class="mb-5">
        <div class="is-flex is-flex-direction-column">
          <p>
            Socials will appear on your profile page so that people can easily
            connect with you.
          </p>

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

      <SubmitButton
        :label="$i18n.t('identity.click')"
        :disabled="disabled"
        :loading="isLoading"
        expanded
        @click="submit" />
    </form>
  </section>
</template>

<script lang="ts" setup>
import { notificationTypes, showNotification } from '@/utils/notification'
import { NeoField, NeoIcon, NeoInput, NeoTooltip } from '@kodadot1/brick'
import type { IdentityFields } from '@/composables/useIdentity'
import DragDrop from '@/components/shared/DragDrop.vue'
import PillTabs, { PillTab } from '@/components/shared/PillTabs.vue'

enum Social {
  Riot = 'riot',
  Twitter = 'twitter',
}

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

const Auth = defineAsyncComponent(() => import('@/components/shared/Auth.vue'))
const BasicInput = defineAsyncComponent(
  () => import('@/components/shared/form/BasicInput.vue')
)
const Loader = defineAsyncComponent(
  () => import('@/components/shared/Loader.vue')
)
const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)
const SubmitButton = defineAsyncComponent(
  () => import('@/components/base/SubmitButton.vue')
)

const { $i18n } = useNuxtApp()
import { useIdentityStore } from '@/stores/identity'

const { apiInstance } = useApi()
const { accountId, balance } = useAuth()
const { urlPrefix } = usePrefix()
const identityStore = useIdentityStore()
const { howAboutToExecute, isLoading, initTransactionLoader, status } =
  useMetaTransaction()
const identity = ref<IdentityFields>({})
const deposit = ref('0')
const inputLengthLimit = ref(32)

const { identity: identityData } = useIdentity({
  address: accountId,
})

watch(identityData, () => {
  const { display, legal, web, twitter, riot, email } = identityData.value
  identity.value = {
    display,
    legal,
    web,
    twitter,
    riot,
    email,
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

const submit = async (): Promise<void> => {
  const api = await apiInstance.value
  initTransactionLoader()
  const cb = api.tx.identity.setIdentity
  const args = [enhanceIdentityData()]
  howAboutToExecute(accountId.value, cb, args, onSuccess)
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
