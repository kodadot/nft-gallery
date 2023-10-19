<template>
  <div>
    <div class="is-centered columns">
      <div class="is-4-widescreen column">
        <img src="/migrate/congrats.svg" alt="Congratulations" class="w-100" />
        <h1 class="is-size-3 has-text-weight-bold has-text-centered">
          {{ $t('migrate.congrats.title') }}
        </h1>
        <p class="has-text-centered is-size-5">
          {{ $t('migrate.congrats.subtitle') }}
        </p>
        <p class="has-text-centered has-text-grey mt-5">
          {{
            $t('migrate.congrats.notes', [
              'Collection Name Here',
              source?.text,
              destination?.text,
            ])
          }}
        </p>

        <div class="is-flex mt-5 is-justify-content-center">
          <NeoButton variant="pill" class="mr-2">
            {{ $t('migrate.congrats.cta') }}
          </NeoButton>
          <NeoButton variant="pill" class="ml-2">
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

definePageMeta({
  layout: 'no-footer',
})

const route = useRoute()
const source = availablePrefixWithIcon().find(
  (item) => item.value === route.query.source,
)
const destination = availablePrefixWithIcon().find(
  (item) => item.value === route.query.destination,
)
</script>
