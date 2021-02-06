<template>
  <div>
    <div class="box">
      <p class="title">
        Frequently Asked Question
      </p>
      <div v-for="qa in faqQuestionsAnswers"
        v-bind:key="qa[0]">
        <p class="title">
          {{qa[0]}}
        </p>
        <p class="subtitle">
          {{qa[1]}}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class  extends Vue {

  public faqQuestionsAnswers: any = [
    ['What coin is used for NFTs?', 'Kusama, you can get it through our Credit feature, using fiat on-ramp.'],
    ['What wallet do I need to mint, buy and collect?', 'Polkadot extension for now, you can find it in Chrome Store'],
    ['How to mint my work?','We will have video demo for that'],
    ['How I can trade KSM for my artwork?','Its supported widely on popular exhchanges, liqudity on exchanges is around $200M, plenty'],
    ['How I can buy KSM?', 'We have integration with Ramp.network. You can use Revolut, Manual bank transfer, Debit Card and Apple Pay to top-up'],
    ['Ive got errors, how to resolve them?', 'We are trying delivering incremental updates & fixes ASAP and may we published new version and your browser has cached old one. If you are on Windows, try hold down Ctrl and then press F5. Mac users, hold down CMD and Shift and then press R. If this did not help, DMs on Twitter with screenshot where is developer console open.']
  ];
  @Prop() public value!: any;
}
</script>
