<template>
  <!-- empty template, to remove warning "[Vue warn]: Failed to mount component: template or render function not defined." -->
  <div></div>
</template>

<script lang="ts" setup>
const router = useRouter()
const { pathname } = useRequestURL()

onBeforeMount(() => {
  router.replace(`${pathname}/collectibles`)
})
</script>
