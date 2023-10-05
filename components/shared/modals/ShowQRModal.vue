<template>
  <ModalWrapper icon="qrcode" :title="title" :type="type">
    <template #default>
      <QRCode :text="qrCodePath" />
    </template>
  </ModalWrapper>
</template>

<script lang="ts" setup>
import ModalWrapper from './ModalWrapper.vue'
import QRCode from '@/components/shared/QRCode.vue'

const props = withDefaults(
  defineProps<{
    address: string
    title: string
    type: string
  }>(),
  {
    type: 'is-bordered-light',
  },
)

const qrCodePath = ref(props.address || 'https://http.cat/409')
</script>
