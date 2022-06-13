<template>
  <b-field>
    <Auth />
  </b-field>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
}

@Component({ components })
export default class AuthField extends Vue {}
</script>
