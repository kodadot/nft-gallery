<template>
  <ClaimForm />
</template>

<script lang="ts">
import ClaimForm from '@/components/poap/claim/ClaimForm.vue'

definePageMeta({
  layout: 'centered-half-layout',
})

export default {
  name: 'ClaimPage',
  components: {
    ClaimForm,
  },
  setup() {
    useHead({
      title: 'Claim',
      meta: [
        {
          name: 'description',
          content: 'Create carbonless NFTs with low on-chain fees',
        },
      ],
    })
  },
}
</script>
