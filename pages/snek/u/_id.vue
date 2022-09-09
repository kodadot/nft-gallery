<template>
  <ProfileDetail />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ProfileDetail from '@/components/rmrk/Profile/ProfileDetail.vue'

const components = {
  ProfileDetail,
}

@Component<ProfilePage>({
  name: 'ProfilePage',
  components,
})
export default class ProfilePage extends Vue {}
</script>
