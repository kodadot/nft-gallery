<template>
  <ModalWrapper icon="qrcode" :title="title" :type="type">
    <template #default>
      <QRCode :text="qrCodePath" color="#db2980" bg-color="#000" />
    </template>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

const components = {
  ModalWrapper: () => import('./ModalWrapper.vue'),
  QRCode: () => import('@/components/shared/QRCode.vue'),
}

@Component({
  name: 'ShowQRModal',
  components,
})
export default class ShowQRModal extends Vue {
  @Prop({ type: String, required: true }) public address!: string
  @Prop({ type: String }) public title!: string
  @Prop({ type: String, default: 'is-bordered-light' })
  public type?: string

  get qrCodePath(): string {
    return this.address || 'https://http.cat/409'
  }
}
</script>
