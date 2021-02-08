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
          <span v-html="qa[1]"></span>
        </p>
        <br>
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
    ['Ive got errors, how to resolve them?', 'We are trying delivering incremental updates & fixes ASAP and may we published new version and your browser has cached old one. If you are on Windows, try hold down Ctrl and then press F5. Mac users, hold down CMD and Shift and then press R. If this did not help, DMs on Twitter with screenshot where is developer console open.'],
    ['What does SEND, CONSUME, LIST mean?', 'SEND will send it to someone, CONSUME will burn it, LIST will list it for sale so someone can buy it from you.'],
    ['I\'ve minted NFT, but I don\'t see it in gallery, where is it?', 'Best way is to check through <a href="https://kusama.subscan.io/">Subscan Explorer</a> and lookup your address. <a href="https://kusama.subscan.io/extrinsic/6095478-1">You can find example how minted NFT looks through explorer, when you look on extrinsics.</a>'],
    ['What countries fiat on-ramp support?', 'Well right now, we are aware that US is not supported. This is out of our control right now. <a href="https://support.ramp.network/en/article/what-countries-do-you-support-1ua7sn1/">Full list of supported countries</a>']
  ];
  @Prop() public value!: any;
}
</script>
