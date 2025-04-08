<template>
  <NeoModal
    append-to-body
    :value="isModalActive"
    @close="isModalActive = false"
  >
    <NeoModalHead
      :title="$t('create')"
      @close="isModalActive = false"
    />
    <div class="px-6 pt-6 pb-5">
      <div class="space-y-4">
        <div
          v-for="item in createOptionsConfig"
          :key="item.path"
          :data-testid="item.testId"
          class="cursor-pointer max-w-[316px] w-full bg-k-grey-light border border-k-grey-light hover:bg-blue-light-cards hover:border-k-blue-hover px-[20px] py-2 flex items-center group"
          @click="onClickCreateOption(item.path)"
        >
          <KIcon
            :name="item.icon"
            size="medium"
            class="text-k-grey group-hover:text-k-blue"
          />
          <div class="text-left ml-4">
            <div>
              {{ item.title }}
            </div>
            <div class="text-sm text-k-grey">
              {{ item.description }}
            </div>
          </div>
        </div>
      </div>

      <div class="text-center text-sm text-k-grey mt-[20px] capitalize">
        {{ $t('mint.modal.availableOn', enableCreateChains) }}
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal, NeoModalHead } from '@kodadot1/brick'
import { enableCreateChains } from '@/utils/chain'

type CreateConfig = {
  path: string
  icon: string
  title: string
  description: string
  testId?: string
}

const isModalActive = defineModel({ type: Boolean, default: false })

const { doAfterLogin } = useDoAfterlogin()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()

const onClickCreateOption = (path: string) => {
  isModalActive.value = false
  doAfterLogin({
    onLoginSuccess: () => {
      navigateTo({ path })
    },
  })
}

const createOptionsConfig = computed<CreateConfig[]>(() => [
  {
    path: '/create/nft',
    icon: 'i-mdi:image-outline',
    title: $i18n.t('mint.modal.createSingle'),
    description: $i18n.t('mint.modal.createSingleDesc'),
    testId: 'create-landing-single-nft-button',
  },
  {
    path: `/${urlPrefix}/massmint`,
    icon: 'i-mdi:image-multiple-outline',
    title: $i18n.t('mint.modal.createMultiple'),
    description: $i18n.t('mint.modal.createMultipleDesc'),
    testId: 'create-landing-multiple-nft-button',
  },
  {
    path: '/create/collection',
    icon: 'i-mdi:folder-open',
    title: $i18n.t('mint.modal.createCollection'),
    description: $i18n.t('mint.modal.createCollectionDesc'),
    testId: 'create-landing-collection-button',
  },
])
</script>
