<template>
  <footer class="footer-container section">
    <div
      class="container is-flex is-align-items-start is-justify-content-space-between">
      <div class="footer-container-subs is-flex is-flex-direction-column">
        <h4 class="subtitle is-5">
          {{ $t('footer.subscribe') }}
        </h4>
        <div class="is-flex is-align-items-center footer-container-subs-items">
          <div id="custom-substack-embed"></div>

          <script>
            window.CustomSubstackWidget = {
              substackUrl: 'kodadot.substack.com',
              placeholder: 'jane.doe@kodadot.xyz',
              theme: 'custom',
              colors: {
                primary: '#FF7AC3',
                input: '#FFFFFF',
                email: '#000000',
                text: '#000000',
              },
            }
          </script>
          <script src="https://substackapi.com/widget.js" async></script>
        </div>
      </div>
      <div class="footer-container-info is-flex is-flex-direction-column">
        <h4 class="subtitle is-5">KodaDot</h4>
        <div>
          <ul class="footer-container-info-list">
            <li
              v-for="item in menu"
              :key="item.url"
              class="footer-container-info-list-item">
              <a
                v-if="item.external"
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="is-flex is-align-items-center">
                {{ item.name }}
                <b-icon icon="external-link-alt" class="ml-1" size="is-small">
                </b-icon>
              </a>
              <nuxt-link v-else :to="item.url">
                {{ item.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-container-socials is-flex is-flex-direction-column">
        <h4 class="subtitle is-5">
          {{ $t('footer.join') }}
        </h4>
        <ul class="footer-container-socials-list is-flex">
          <li
            v-for="item in socials"
            :key="item.url"
            class="footer-container-socials-list-item is-flex is-align-items-center is-justify-content-center mr-2"
            @click="goToSocials(item.url)">
            <a
              class="is-flex"
              rel="noopener noreferrer"
              :aria-label="item.name">
              <b-icon
                :pack="item.name == 'Swag' ? 'fas' : 'fab'"
                :icon="item.icon"
                size="is-small"
                :type="isDarkMode ? 'is-white' : 'is-black'" />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <img src="/blurred-landing-footer.svg" class="left-blurred-image" />
  </footer>
</template>

<script lang="ts" setup>
import { TranslateResult } from 'vue-i18n/types'

interface Menu {
  name: TranslateResult
  url: string
  external?: boolean
}

const { $i18n } = useNuxtApp()
const { isDarkMode } = useTheme()

const menu: Menu[] = [
  {
    name: $i18n.t('about'),
    url: '/about',
  },
  {
    name: $i18n.t('faq.page'),
    url: '/faq',
  },
  {
    name: $i18n.t('careers'),
    url: '/jobs',
  },
  {
    name: $i18n.t('contribute'),
    url: '/contribute',
  },
  {
    name: $i18n.t('referralProgram'),
    url: 'https://docs.kodadot.xyz/referral-program.html',
    external: true,
  },
  {
    name: $i18n.t('documentation'),
    url: 'https://docs.kodadot.xyz/',
    external: true,
  },
  {
    name: $i18n.t('press kit'),
    url: 'https://github.com/kodadot/kodadot-presskit/tree/main/v3',
    external: true,
  },
  {
    name: $i18n.t('ambassador program'),
    url: 'https://docs.kodadot.xyz/ambassador-program/ambassador-intro.html#the-opportunity',
    external: true,
  },
]

const socials = [
  {
    name: 'Discord',
    url: 'https://discord.gg/u6ymnbz4PR',
    icon: 'discord',
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com/r/KodaDot',
    icon: 'reddit-alien',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/KodaDot',
    icon: 'twitter',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/kodadot.xyz',
    icon: 'instagram',
  },
  {
    name: 'Swag',
    url: 'https://shop.kodadot.xyz',
    icon: 'shop',
  },
  {
    name: 'Youtube',
    url: 'https://www.youtube.com/channel/UCEULduld5NrqOL49k1KVjoA/',
    icon: 'youtube',
  },
  {
    name: 'Medium',
    url: 'https://medium.com/kodadot',
    icon: 'medium',
  },
]
const goToSocials = (url): void => {
  window.open(url, '_blank')
}
</script>
