<template>
  <Drops />
</template>

<script lang="ts" setup>
import { dropsVisible } from '@/utils/config/permission.config'

const route = useRoute()

useSeoMeta({
  title: 'Drops',
  description: 'View all drops',
  ogUrl: route.path,
})

definePageMeta({
  layout: 'no-footer',
})

const { urlPrefix } = usePrefix()
const checkRouteAvailability = () => {
  if (!dropsVisible(urlPrefix.value)) {
    return navigateTo('/')
  }
}

watchEffect(checkRouteAvailability)
onBeforeMount(checkRouteAvailability)
</script>
