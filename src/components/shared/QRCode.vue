<template>
  <div class="qr-code-wrapper"></div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import QRCode from '@keeex/qrcodejs-kx'
import shouldUpdate from '@/utils/shouldUpdate'

@Component({})
export default class QRCodeComponent extends Vue {
  @Prop({ type: String, required: true }) public text!: string;
  @Prop({ type: Number, required: false, default: 256 }) public size!: number;
  @Prop({ type: String, required: false, default: '#000' }) public color!: string;
  @Prop({ type: String, required: false, default: '#FFF' })
  public bgColor!: string;
  @Prop({
    type: String,
    validator: function(value) {
      return value === 'L' || value === 'M' || value === 'Q' || value === 'H'
    },
    required: false,
    default: 'H'
  })
  public errorLevel!: string;

  protected qrCode: Record<string, any> | null = null

  public mounted(): void {
    this.qrCode = new QRCode(this.$el, {
      text: this.text,
      width: this.size,
      height: this.size,
      colorDark : this.color,
      colorLight : this.bgColor,
      correctLevel : QRCode.CorrectLevel[this.errorLevel]
    })
  }

  protected clear(): void {
    this.qrCode?.clear()
  }

  protected makeCode(text: string): void {
    this.qrCode?.makeCode(text)
  }

  @Watch('text')
  handleTextChange(val: string, oldVal: string): void {
    if (shouldUpdate(val, oldVal)) {
      this.clear()
      this.makeCode(val)
    }
  }

}
</script>

<style>
.qr-code-wrapper > canvas > img {
  margin: auto !important;
}
</style>
