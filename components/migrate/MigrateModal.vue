<template>
  <div class="mx-5 my-4">
    <p>{{ $t('migrate.modal.title') }}</p>
    <p class="text-k-grey text-xs">
      {{ $t('migrate.modal.subtitle') }}
    </p>

    <div class="mt-5 flex">
      <p
        class="mr-5 font-bold cursor-pointer"
        @click="$emit('close', true)"
      >
        {{ $t('migrate.modal.yes') }}
      </p>
      <p
        class="cursor-pointer"
        @click="$emit('close', false)"
      >
        {{ $t('migrate.modal.no') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>
