<template>
  <div :id="id">
    <slot name="trigger" :handle-open="handleOpen">
      <b-button
        :type="type"
        :icon-left="icon"
        :expanded="expanded"
        :class="{
          'modal-wrapper-button__right': isRight,
          'is-invisible': isButtonHidden,
        }"
        @click="handleOpen">
        <template v-if="label">{{ label }}</template>
      </b-button>
    </slot>
    <NeoModal v-model="isModalActive" @close="isModalActive = false">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            {{ label || title }}
          </p>
          <slot name="hint" />
        </header>
        <div class="card-content has-text-centered">
          <slot></slot>
        </div>
      </div>
    </NeoModal>
  </div>
</template>

<script lang="ts" setup>
import { NeoModal } from '@kodadot1/brick'
interface Props {
  label: string
  title: string
  icon: string
  type?: string
  expanded: boolean
  isRight: boolean
  id: string
  isButtonHidden: boolean
}

withDefaults(defineProps<Props>(), {
  id: '',
  isButtonHidden: false,
})

const isModalActive = ref(false)
const handleOpen = () => {
  isModalActive.value = true
}
</script>

<style scoped lang="scss">
.modal-wrapper-button__right {
  float: right;
}
</style>
