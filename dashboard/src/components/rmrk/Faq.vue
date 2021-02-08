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
    ['What coin is used for NFTs?', '<a href="https://kusama.network/">Kusama, $KSM</a>. You can get it through our <a href="#/rmrk/credit">Credit</a> feature or <a href="https://www.binance.com/en/register?ref=T1JB89F0">through custodial exchange</a>.'],
    ['What wallet do I need to mint, buy and collect?', 'We reccommend you to use <a href="https://polkadot.js.org/extension/">Polkadot Extension for now</a>. Later we plan to add mobile-first experience. In all cases, <b>backup your seed, it\s your owners right and sort of value.</b>'],
    ['How I\'ll mint my work?','You will go to the <a href="/#/rmrk/create">Create</a>. You need to first mint your Collection and then Token. If you want to video that, DM us!'],
    ['How I can trade KSM for my artwork?','Its supported widely on popular exchanges. Daily liqudity on exchanges is around $200M at time of writing and 1 $KSM is traded for ~ $100.'] ,
    ['How I can buy KSM as new-comer?', 'We have integration with <a href="https://ramp.network">Ramp.network</a>, click on <a href="#/rmrk/credit">Credit in navbar</a>. You can use Revolut, Manual bank transfer, Debit Card and Apple Pay to top-up your KSM address. You can <a href="https://www.binance.com/en/register?ref=T1JB89F0">buy $KSM at Binance</a>'],
    ['How I can buy KSM with ETH, DAI, BTC..?', 'For best rates, you can <a href="https://www.coingecko.com/en/coins/edgeware#markets">use custodial exchange from list</a>. For best experience  <a href="https://www.binance.com/en/register?ref=T1JB89F0">we reccommend you to use Binance</a>. If you are <a href="https://simpleswap.io/?ref=6cc6e0c538ad">looking for simple trade, try SimpleSwap</a>.'],
    ['Can I use this in virtual worlds?', 'We are exploring possibilities, we actually plan to actively research on this in our milestone 2'],
    ['I\'ve got errors, how to resolve them?', 'We are trying delivering incremental updates on daily basis & fixes ASAP. We may published new version and your browser has cached old one. If you are on <b>Windows</b>, try hold down <b>Ctrl and then press F5</b>. <b>Mac users</b>, hold down <b>CMD and Shift and then press R</b>. If this did not help, DMs on Twitter with screenshot where is developer console open.'],
    ['What does SEND, CONSUME, LIST mean?', 'SEND will send it to someone, CONSUME will burn it, LIST will list it for sale so someone can buy it from you.'],
    ['I\'ve minted NFT, but I don\'t see it in gallery, where is it?', 'Best way is to check through <a href="https://kusama.subscan.io/">Subscan Explorer</a> and lookup your address. <a href="https://kusama.subscan.io/extrinsic/6095478-1">You can find example how minted NFT looks through explorer, when you look on extrinsics.</a>'],
    ['What countries fiat on-ramp support?', 'Right now, we are aware that US is not supported, other all countries should work, <a href="https://support.ramp.network/en/article/what-countries-do-you-support-1ua7sn1/">full list of supported countries</a>. This is out of our control right now.'],
    ['How I will sell my token?','Right now, you will use LIST in Actions'],
    ['Royalties streams settings?', 'Right now, we don\'t have chain logic, but we plan to implement something great, soon. <a href="https://twitter.com/kodadot">Stay with us and follow us @KodaDot!</a>'],
    ['How I can create own shop?','We are implementing collection view, sets of collection view. <a href="https://twitter.com/kodadot">Stay with us and follow us @KodaDot!</a>'],
    ['How appreaciations works?', 'It\'s that heart 🖤 under NFT token. We are <a href="https://github.com/Swader/rmrk-spec/issues/10">origin authors of EMOTE in RMRK standard</a> which works like appreciations. It\'s function is price discovery for your work.' ],
    ['Are you funded?','Right now, we have <a href="https://kusama.polkassembly.io/post/384">Kusama Treasury funding for Milestone 1</a>. We are actively looking for funding options, eventually we would raise private funds. DMs us, if you are interested into private sale.'],
    ['Are you have Telegram channel?', 'We have only private channel for NFT creators, DM us if you are NFT creator!']
  ];
  @Prop() public value!: any;
}
</script>
