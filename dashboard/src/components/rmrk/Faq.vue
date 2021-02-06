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
    ['How I can trade KSM for my artwork?','Its supported widely on popular exhchanges, liqudity on exchanges is around $200M, plenty']
    ];
  @Prop() public value!: any;
}
</script>
