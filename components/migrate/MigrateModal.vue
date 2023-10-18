<template>
  <div class="mx-5 my-4">
    <p>Are you sure you want to leave?</p>
    <p class="has-text-grey is-size-7">Any progress here will be lost.</p>

    <div class="mt-5 is-flex">
      <p
        class="mr-5 has-text-weight-bold is-cursor-pointer"
        @click="$emit('close', { action: 'yes' })">
        Yes, Leave
      </p>
      <p class="is-cursor-pointer" @click="$emit('close', { action: 'no' })">
        Cancel
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>
