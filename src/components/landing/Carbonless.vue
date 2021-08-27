<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-6 is-offset-3">
              <h1 class="title is-1">
                <b-icon icon="leaf"></b-icon>
                Carbonless NFT Movement
              </h1>
              <h1 class="subtitle">
                KodaDot is going to be carbon-negative gallery, by default
              </h1>
              <p>
                We are trying to set a movement where artists can offset their mints.
                Simple as that. Even we are running on a low carbon blockchain
                <b><a href="https://Kusama.network">Kusama.network</a></b>
                and plan to roll out our own NFT-focused infrastructure parachain
                <b><a href="https://Metaprime.network">MetaPrime.network</a></b>,
                we feel that we should step up in the game and be more carbon neutral
                and later contribute to be carbon negative gallery
                in a way to drive global forestation. To help artists mitigate the negative
                effects of expanding society on the planet.
                At least, we might contribute to do the small job here.
                The audience will decide.
              </p><br>
              <h1 class="title is-4">
                Carbon Neutral Mission of Kodadot
              </h1>
              <p>
                The mission of Kodadot gallery is to flow collectors' resources to environmentally
                conscious digital art creation in a way to address the Earth's mounting climate crisis.
                We have intent to bring
                <b><a href="https://github.com/kodadot/nft-gallery/issues?q=is%3Aissue+label%3Acarbonless">carbon calculator</a></b>
                and help to make forestations and offsetting as new normal and easy access.
                To kick-start this effort, we've partnered with Offsetra which allows users to
                support <i>"high-quality pro-climate projects via the purchase of carbon offsets credits"</i>.
                <br><br>
                Carbon offset credits come from a variety of sustainability-oriented projects.
                Offsetra only sources offsets from validated and verified projects under strict
                internationally recognized standards. You can find more information on <br>Offsetra's
                process is available <a href="https://offsetra.com/">on their website</a>.</br>
              </p><br>
              <h1 class="title is-4">
                Humble actions
              </h1>
              <p>
                We are aware that just by purchasing Carbon Offsets we won't solve the issue,
                but <b>we can be small butterfly effect, and later jumpstart impactful actions to
                start a forestation movement on bigger scale</b>,
                where it would be native for NFT galleries to bring with every mint,
                buying offsets in a way to put a small amount of % towards buying carbon offsets and forestation.

                We will try to put at least some amount of artists' profits based on their decision to
                drive towards buying credit offsets. Not just feel good about, but with a real impactful way to do proove it.
              </p><br>
              <h1 class="title is-4">
                Building impactful environmental relief
              </h1>
              <p>
                Our first start is to add a toggle to our minting interface where every artist could
                choose if they want to support carbon credits or not. We will be adding the <b>🌱 carbonless</b>
                tag to NFT and later it could be tracked through the search interface and reviewed on-chain.
                Thus collectors might find it innovative to collect carbonless NFTs.

                Once Offsetra (or other carbon credit partners) figure out a way to make fiat off-ramp
                payments from Kusama for carbon-offsets to happen, we will make a full end-to-end native
                crypto integration with them, so every NFT will consist hash relying on Carbon Credit.

                To drive the vision to home, we are genuinely looking forward to starting with
                <b><a href="https://yangwao.medium.com/planet-terraformation-forest-as-a-service-94a2633ad011">
                Terraformation of Planet Earth</a></b>
                where one could participate in fashion to own part of the forest, probably introduce
                the concept of <b>Forest as a Service</b>. Imagination is the limit.
              </p></br>
              <h1 class="title is-4">
                We are not only one and that's great
              </h1>
              <p>
                We are really aware that movement is just about to begin when news outlets started
                heating discussion and <b><a href="https://twitter.com/search?q=%23CleanNFT&src=typeahead_click">
                #cleanNFT movement</a></b>
                has begun. One option for the creator is to <b>
                <a href="https://docs.google.com/spreadsheets/d/1A-7Ama31sYWhXDl6NoJaXnbAV9pFbjxLIgl7jb3CHOs/edit#gid=0">
                choose from a variety of NFT platforms running
                on low carbon blockchains</a></b>
                which is really great start. Another option is to actively drive
                movement to be <a href="https://offsets.gallery/">carbon-negative gallery</a>.<br>
              </p><br>
              <h1 class="title is-4">
                Our proof of work
              </h1>
              <p>
                We (Kodadot) are feeling inspired to join this movement in our fashioned way
                <b>to add carbonless minting for creators</b> and start showing which NFTs are
                carbonless by showing 🌱 next to them. To top-up our carbon credits buffer,
                <b><a href="https://nft.kodadot.xyz/rmrk/detail/7369221-0E76E3AC15B4C1FA1E-VCU-KODADOT_CARBON_CREDITS-0000000000000001">we've already
                bought KodaDot Carbon Credits</a></b> and plan to automatize offset them in the future more in sustainabile way.<br>
                <b>You can read more at <a href="https://offsetra.com/profile/kodadot">KodaDot's profile page at Offsetra</a></b><br><br>
                Once you minted your <b>carbonless NFT on KodaDot,
                <u><a href="https://t.me/joinchat/aE-i3mgMAo9lMTU0">you are welcome to join our Carbonless Minting Telegram channel</a> and <a href="https://discord.gg/u6ymnbz4PR">KodaDot Discord</a></u></b>
              </p><br>
              <h1 class="title is-4">
                Reading list
              </h1>
              <p>
                Whenever you want to learn more about cleanNFTs,
                <u><a href="https://github.com/kodadot/nft-gallery/issues/346">we left some material in our issues.</a></u>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator';


@Component<Carbonless>({
  metaInfo() {
    return {
      title: 'KodaDot cares about environmental impact',
      titleTemplate: '%s | Low Carbon NFTs',
      meta: [
        { name: 'description', content: 'Creating Carbonless NFTs on Kusama' },
        { property: 'og:title', content: 'KodaDot cares about environmental impact'},
        { property: 'og:image', content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
        { property: 'og:description', content: 'Creating Carbonless NFTs on Kusama'},
        { property: 'twitter:title', content: 'KodaDot cares about environmental impact'},
        { property: 'twitter:description', content: 'Creating Carbonless NFTs on Kusama'},
        { property: 'twitter:image', content: 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
      ]
    }
  },
  components: {}
})
export default class Carbonless extends Vue {

}
</script>
