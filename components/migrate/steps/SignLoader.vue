<template>
  <div>
    <p class="my-5">Follow Steps:</p>
    <!-- step 1 phase -->
    <MigrateStepsSignLoader1 />

    <!-- step 2 phase -->
    <MigrateStepsSignLoader2 />

    <!-- step 3 phase -->
    <MigrateStepsSignLoader3 />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.v-border {
  width: 1px;
  background-color: black;
  margin-left: 20px;
  margin-right: 41px;
}
</style>
