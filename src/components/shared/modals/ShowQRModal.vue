<template>
    <ModalWrapper :icon="'qrcode'">
      <template v-slot:default>
        <QRCode text="https://http.cat/409" color="#db2980" bgColor="#000" />
      </template>
    </ModalWrapper>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'

const components = {
  ModalWrapper: () => import('./ModalWrapper.vue'),
  QRCode: () => import('@/components/shared/QRCode.vue'),
}

@Component({
  name: 'ShowQRModal',
  components
})
export default class ShowQRModal extends Vue {
  @Prop({ type: String, required: true }) public address!: string
}
</script>
