<template>
  <!-- empty template, to remove warning "[Vue warn]: Failed to mount component: template or render function not defined." -->
  <div></div>
</template>

<script lang="ts" setup>
const router = useRouter()

onBeforeMount(() => {
  router.replace(`${window.location.pathname}/collectibles`)
})
</script>
