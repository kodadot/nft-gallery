<template>
  <div>
    <h1 class="title is-1">
      <b-icon icon="leaf" />
      Sustainability of KodaDot
    </h1>
    <h1 class="subtitle">
      micro-dao-bedrock-boostrap experiment
    </h1>
    <p>
      As part of our micro-dao-bedrock-boostrap experiment,
      we would like to keep our efforts sustainable <b>in the long-run
        and create trust from creators culture</b> and economy for KodaDot
      that we will won't dissapear tomorrow and keep running as long
      we can cover our efforts to keep it online and working.
    </p><br>
    <p>
      We will be slowly elaborating what is best possible way to embrace
      Creators economy needs and help them to make sustainable living out of
      their work. <b>We are here to support the case</b>. On other part,
      we need to mind our long-term sustainability.
      We are in position being universal viewer and
      not being landlord in form of platform as other galleries do.
    </p><br>
    <p>
      Right now our only income was approved
      <a href="https://kusama.polkassembly.io/motion/256">proposal#384 &
        motion#256 from Kusama Treasury funding</a>
      for milestone1. Mostly it went for development costs,
      not for running and further maintance costs.
    </p><br>
    <p>
      Out flow of funds will have three parts. <b>Artists support program,
        Running costs and Research & Development costs</b>. From start,
      we will put some of our savings into bedrock fund.
    </p><br>
    <p>
      <a href="https://github.com/kodadot/nft-gallery/issues/141">
        Running costs</a> consist paying up Netlify (http, cdn, CI&CD),
      Pinata (IPFS), Arweave (free for now, later paid integration),
      Textile.io (we expecting this costs would go linear, later exponential).
      Maintance, R&D costs need to be paid as
      <a href="https://github.com/kodadot/nft-gallery/issues">our backlog of
        new features is popping up</a> and we are <b>trying invite more developers
        to our circles by putting bounties on issues</b>.
      Anyone can join and help with our efforts.
    </p><br>
    <p>
      As we would like to establish our accrual vector for sustainibility fund
      and introduce <b>small fee through minting</b> through KodaDot,
      we will be adding button where you still can voluntary opt-out
      and mint without supporting us at all.
    </p><br>
    <p>
      To <b>give community value back</b>, we are about to establish
      <b><a href="https://hackmd.io/cy3jpAhvR-S32SUiMqEabg?edit">artists-support-program</a></b>
      which will flow back to artists. We are trying to create self-reinforcment
      accrual cycle, where you as creator supporting KodaDot gallery will flow back
      and support new artists, thus creating network effects for early adopters and
      next wave of adopters and so on, which will later could be self-propelled at some point
      if we manage to crack on the right tokenomics.
      We just need play bit more with right flow curves. It's experiment.
    </p><br>
    <p>
      Current holders of multisig are founders of KodaDot --
      <a href="https://twitter.com/yangwao">yangwao</a> &
      <a href="https://twitter.com/vikiival">vikiival</a>
      and later it will expand as we will create trust with
      broader community who would like to participate as we
      expect Treasury could grow larger next day.
    </p><br>
    <h1 class="title is-4">
      <a href="https://www.dictionary.com/browse/sustainability">Definition of Sustainability</a>
    </h1>
    <h1 class="subtitle">
      noun
    </h1>
    <ul>
      <li>the ability to be sustained, supported, upheld, or confirmed.</li>
      <li>Environmental Science. the quality of not being harmful to the environment or depleting natural resources, and thereby supporting long-term ecological balance:</li>
    </ul>
  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Sustainibility>({
  head() {
    const metaData = {
      description: 'KodaDot: Sustainibility mission',
      url: '/sustainibility',
      image: `${this.$config.baseUrl}/k_card_mint.png`,
    }
    return {
      meta: [...this.$seoMeta(metaData)]
    }
  }
})
export default class Sustainibility extends Vue {
  layout() {
    return 'centered-half-layout'
  }
}
</script>
