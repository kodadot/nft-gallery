<template>
  <footer class="footer-container px-6 py-12" data-testid="footer-container">
    <div class="footer-container-inner flex items-start justify-between">
      <section class="footer-container-subs flex flex-col">
        <h2 class="subtitle is-5">
          {{ $t('footer.subscribe') }}
        </h2>
        <div class="flex items-center footer-container-subs-items">
          <CustomSubstackEmbed />
        </div>
      </section>
      <div class="footer-container-links">
        <section class="footer-container-info flex flex-col">
          <h2 class="subtitle is-5">Incentives</h2>
          <div>
            <ul class="footer-container-list">
              <li
                v-for="item in menuIncentives"
                :key="item.url"
                class="footer-container-info-list-item">
                <a
                  v-if="item.external"
                  v-safe-href="item.url"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  class="flex items-center">
                  {{ item.name }}
                  <NeoIcon icon="arrow-up-right" class="ml-1 text-k-grey" />
                </a>
                <nuxt-link v-else :to="item.url">
                  {{ item.name }}
                </nuxt-link>
              </li>
            </ul>
          </div>
        </section>
        <section class="footer-container-info flex flex-col">
          <h2 class="subtitle is-5">Marketplace</h2>
          <div>
            <ul class="footer-container-list">
              <li
                v-for="item in menuMarketplace"
                :key="item.url"
                class="footer-container-info-list-item">
                <a
                  v-if="item.external"
                  v-safe-href="item.url"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  class="flex items-center">
                  {{ item.name }}
                  <NeoIcon icon="arrow-up-right" class="ml-1 text-k-grey" />
                </a>
                <nuxt-link v-else :to="item.url">
                  {{ item.name }}
                </nuxt-link>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <section class="footer-container-info flex flex-col">
        <h2 class="subtitle is-5">KodaDot</h2>
        <div>
          <ul class="footer-container-list">
            <li
              v-for="item in menuKodadot"
              :key="item.url"
              class="footer-container-info-list-item">
              <a
                v-if="item.external"
                v-safe-href="item.url"
                target="_blank"
                rel="nofollow noopener noreferrer"
                class="flex items-center">
                {{ item.name }}
                <NeoIcon icon="arrow-up-right" class="ml-1 text-k-grey" />
              </a>
              <nuxt-link v-else :to="item.url">
                {{ item.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </section>
      <section class="footer-container-socials flex flex-col">
        <h2 class="subtitle is-5">
          {{ $t('footer.join') }}
        </h2>
        <ul class="footer-container-socials-list flex mb-6">
          <li
            v-for="item in socials"
            :key="item.url"
            class="footer-container-socials-list-item flex items-center justify-center">
            <a
              v-safe-href="item.url"
              rel="nofollow noopener noreferrer"
              target="_blank"
              role="link"
              :aria-label="item.name">
              <!-- substack doesnt have a font awesome icon -->
              <svg
                v-if="item.icon === 'substack'"
                width="16"
                height="16"
                viewBox="0 0 448 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_6104_83750)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 0H448V62.804H0V0ZM0 229.083H448V511.471L223.954 385.808L0 511.471V229.083ZM0 114.541H448V177.345H0V114.541Z"
                    fill="currentColor" />
                </g>
                <defs>
                  <clipPath id="clip0_6104_83750">
                    <rect width="448" height="511.471" fill="currentColor" />
                  </clipPath>
                </defs>
              </svg>
              <!-- farcaster doesnt have a font awesome icon -->
              <svg
                v-else-if="item.icon === 'farcaster'"
                width="20"
                height="20"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"
                  fill="currentColor" />
                <path
                  d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"
                  fill="currentColor" />
                <path
                  d="M675.556 746.667C663.282 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z"
                  fill="currentColor" />
              </svg>
              <NeoIcon
                v-else
                :pack="item.pack || item.name == 'Swag' ? 'fasr' : 'fab'"
                :icon="item.icon" />
            </a>
          </li>
        </ul>
      </section>
    </div>
    <img
      src="/blurred-landing-footer.webp"
      class="left-blurred-image"
      width="1500"
      height="1400"
      alt="" />
  </footer>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

interface Menu {
  name: string
  url: string
  external?: boolean
}

const { $i18n } = useNuxtApp()

const menuIncentives: Menu[] = [
  {
    name: $i18n.t('ambassador program'),
    url: 'https://hello.kodadot.xyz/be-part-of-kodadot/kodadots-programs/ambassador-program',
    external: true,
  },
  {
    name: $i18n.t('artist ambassador'),
    url: 'https://hello.kodadot.xyz/be-part-of-kodadot/kodadots-programs/artist-ambassador-program',
    external: true,
  },

  {
    name: $i18n.t('referralProgram'),
    url: 'https://hello.kodadot.xyz/be-part-of-kodadot/kodadots-programs/artist-referral-program',
    external: true,
  },
]

const menuMarketplace: Menu[] = [
  {
    name: $i18n.t('developers'),
    url: 'https://developers.kodadot.xyz',
    external: true,
  },
  {
    name: 'FAQ',
    url: 'https://hello.kodadot.xyz/ecosystem/faq',
    external: true,
  },
  {
    name: $i18n.t('tutorial'),
    url: 'https://hello.kodadot.xyz/tutorial/',
    external: true,
  },
]

const menuKodadot: Menu[] = [
  {
    name: $i18n.t('about'),
    url: 'https://hello.kodadot.xyz/about-us/who-are-we',
    external: true,
  },
  {
    name: $i18n.t('careers'),
    url: 'https://hello.kodadot.xyz/be-part-of-kodadot/join-as-a-developer/hiring',
    external: true,
  },
  {
    name: $i18n.t('merchshop'),
    url: 'https://shop.kodadot.xyz',
    external: true,
  },

  {
    name: $i18n.t('press kit'),
    url: 'https://github.com/kodadot/kodadot-presskit/tree/main/pre-v4',
    external: true,
  },
  {
    name: $i18n.t('blog'),
    url: '/blog',
    external: false,
  },
  {
    name: $i18n.t('footer.privacyPolicy'),
    url: '/privacy-policy',
    external: false,
  },
  {
    name: $i18n.t('footer.toc'),
    url: '/terms-of-use',
    external: false,
  },
]

const socials = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/KodaDot',
    icon: 'x-twitter',
  },
  {
    name: 'Beehiiv',
    url: 'https://kodadotweeklyroundup.beehiiv.com',
    icon: 'newspaper',
    pack: 'fal',
  },
  {
    name: 'Linkedin',
    url: 'https://www.linkedin.com/company/kodadot',
    icon: 'linkedin',
  },
  {
    name: 'Medium',
    url: 'https://medium.com/kodadot',
    icon: 'medium',
  },
  {
    name: 'Youtube',
    url: 'https://www.youtube.com/channel/UCEULduld5NrqOL49k1KVjoA/',
    icon: 'youtube',
  },

  {
    name: 'Instagram',
    url: 'https://instagram.com/kodadot.xyz',
    icon: 'instagram',
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com/r/KodaDot',
    icon: 'reddit-alien',
  },
  {
    name: 'Farcaster',
    url: 'https://warpcast.com/~/channel/koda',
    icon: 'farcaster',
  },
]
</script>
