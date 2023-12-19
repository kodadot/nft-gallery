<template>
  <div>
    <div class="is-centered columns">
      <div class="is-4-widescreen column">
        <img :src="congratsSrc" alt="Congratulations" class="w-100" />
        <h1 class="is-size-3 has-text-weight-bold has-text-centered">
          {{ $t('migrate.congrats.title') }}
        </h1>
        <p class="has-text-centered is-size-5">
          {{ $t('migrate.congrats.subtitle') }}
        </p>
        <p class="has-text-centered has-text-grey mt-5">
          {{
            $t('migrate.congrats.notes', [
              collectionName,
              source?.text,
              destination?.text,
            ])
          }}
        </p>

        <div class="flex mt-5 justify-center">
          <NeoButton
            variant="pill"
            class="mr-2"
            :tag="NuxtLink"
            :to="collectionPage">
            {{ $t('migrate.congrats.cta') }}
          </NeoButton>
          <NeoButton
            v-safe-href="shareUrl"
            variant="pill"
            class="ml-2"
            tag="a"
            target="_blank">
            {{ $t('migrate.congrats.share') }}
            <NeoIcon icon="x-twitter" pack="fab" />
          </NeoButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'

type Collection = Ref<{
  collectionEntityById?: {
    name?: string
  }
}>

const NuxtLink = resolveComponent('NuxtLink')

definePageMeta({
  layout: 'no-footer',
})

const { urlPrefix } = usePrefix()
const route = useRoute()
const source = availablePrefixWithIcon().find(
  (item) => item.value === route.query.source,
)
const destination = availablePrefixWithIcon().find(
  (item) => item.value === route.query.destination,
)

const { isDarkMode } = useTheme()
const congratsSrc = computed(() =>
  isDarkMode.value ? '/migrate/congrats-dark.svg' : '/migrate/congrats.svg',
)

const { data } = useGraphql({
  queryName: 'collectionByIdMinimal',
  variables: {
    id: route.query.nextCollectionId,
  },
})

const collectionName = computed(
  () => (data as Collection).value?.collectionEntityById?.name,
)
const collectionId = route.query.nextCollectionId?.toString()
const collectionPage = computed(
  () => `/${urlPrefix.value}/collection/${collectionId}`,
)

const shareUrl = computed(() => {
  const shareUrl = 'https://x.com/intent/tweet?text='
  const currentUrl = `${URLS.koda.baseUrl}${collectionPage.value}`

  return `${shareUrl}${encodeURIComponent(currentUrl)}`
})
</script>
