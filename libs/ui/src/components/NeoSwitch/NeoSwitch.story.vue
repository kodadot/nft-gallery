<template>
  <Story title="NeoSwitch" :layout="{ type: 'grid', width: '600px' }">
    <Variant title="NeoSwitch">
      <NeoSwitch>Default</NeoSwitch>

      <br />

      <NeoSwitch v-model="isSwitched">
        {{ isSwitched }}
      </NeoSwitch>

      <br />

      <NeoSwitch v-model="isSwitchedCustom" true-value="Yes" false-value="No">
        {{ isSwitchedCustom }}
      </NeoSwitch>

      <br />

      <NeoSwitch disabled>Disabled</NeoSwitch>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import NeoSwitch from './NeoSwitch.vue'

const isSwitched = ref(false)
const isSwitchedCustom = ref('Yes')
</script>
