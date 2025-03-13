<template>
  <div class="flex items-center">
    <KIcon
      class="mr-4"
      :name="icon.name"
      :class="icon.class"
    />

    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    fulfilled: boolean
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

const { accountId } = useAuth()

const icon = computed<{ name: string, class: string, spin?: boolean }>(() => {
  if (!accountId.value) {
    return {
      name: 'i-mdi:lock',
      class: 'text-k-grey',
    }
  }

  if (props.loading) {
    return {
      name: 'i-mdi:loading',
      class: 'text-k-grey animate-spin',
    }
  }

  return props.fulfilled
    ? {
        name: 'i-mdi:check',
        class: 'text-k-green',
      }
    : { name: 'i-mdi:close', class: 'text-k-red' }
})
</script>
