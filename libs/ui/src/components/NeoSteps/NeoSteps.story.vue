<template>
  <Story title="NeoSteps" :layout="{ type: 'grid', width: '600px' }">
    <Variant title="NeoSteps">
      <NeoSteps v-model="activeStep" :rounded="false" :has-navigation="false">
        <NeoStepItem clickable label="Account">account</NeoStepItem>
        <NeoStepItem clickable label="Profile">profile</NeoStepItem>
        <NeoStepItem clickable label="Social">social</NeoStepItem>
      </NeoSteps>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import NeoSteps from './NeoSteps.vue'
import NeoStepItem from './NeoStepItem.vue'

const activeStep = ref(0)
</script>
