<template>
  <Massmint />
</template>

<script lang="ts">
import { usePreferencesStore } from '@/stores/preferences'
import { massmintCreateVisible } from '@/utils/config/permission.config'

definePageMeta({
  layout: 'no-footer',
})

export default {
  name: 'MassmintPage',
  middleware({ redirect, params }) {
    if (!usePreferencesStore().getVisitedOnboarding) {
      setTimeout(() => redirect(`/${params.prefix}/massmint/onboarding`))
    }

    if (!massmintCreateVisible(params.prefix)) {
      setTimeout(() => redirect('/'))
    }
  },

  setup() {
    useHead({
      title: 'Massmint',
      meta: [
        {
          name: 'description',
          content: 'Mint multiple NFTs at once',
        },
      ],
    })
  },
}
</script>
