<template>
  <footer
    class="footer-container is-flex is-align-items-start is-justify-content-space-around">
    <div class="footer-container-subs is-flex is-flex-direction-column">
      <span class="footer-container-heading">{{ $t('footer.subscribe') }}</span>
      <div class="is-flex is-align-items-center footer-container-subs-items">
        <!-- <b-input
          v-model="subscriptionEmail"
          class="footer-container-subs-input"
          placeholder="Your Email Address"
          expanded />
        <b-button
          type="is-primary"
          class="footer-container-subs-btn"
          @click="$emit('click')">
          <slot> {{ $t('footer.subscribeLabel') }} </slot>
        </b-button> -->
        <iframe
          height="94"
          src="https://kodadot.substack.com/embed"
          frameborder="0"
          scrolling="no"></iframe>
      </div>
    </div>
    <div class="footer-container-info is-flex is-flex-direction-column">
      <span class="footer-container-heading">KodaDot</span>
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
              rel="noopener noreferrer">
              {{ item.name }}
            </a>
            <nuxt-link v-else :to="item.url">
              {{ item.name }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer-container-socials is-flex is-flex-direction-column">
      <span class="footer-container-heading">{{ $t('footer.join') }}</span>

      <ul class="footer-container-socials-list is-flex">
        <li
          v-for="item in socials"
          :key="item.url"
          class="footer-container-socials-list-item is-flex is-align-items-center is-justify-content-center mr-2">
          <a
            :href="item.url"
            target="_blank"
            class="is-flex"
            rel="noopener noreferrer"
            aria-label="Discord">
            <b-icon
              pack="fab"
              :icon="item.icon"
              size="is-small"
              :type="$colorMode.value === 'dark' ? 'is-white' : 'is-black'" />
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { TranslateResult } from 'vue-i18n/types'

interface Menu {
  name: TranslateResult
  url: string
  external?: boolean
}
@Component({})
export default class Footer extends Vue {
  private subscriptionEmail = ''
  public menu: Menu[] = [
    {
      name: this.$t('about'),
      url: '/about',
    },
    {
      name: this.$t('faq.page'),
      url: '/rmrk/faq',
    },
    {
      name: this.$t('grants'),
      url: 'https://form.kodadot.xyz/grant',
      external: true,
    },
    {
      name: this.$t('documentation'),
      url: 'https://docs.kodadot.xyz/',
      external: true,
    },
    {
      name: this.$t('contribute'),
      url: '/contribute',
    },
    {
      name: this.$t('careers'),
      url: '/jobs',
    },
    {
      name: this.$t('ambassador program'),
      url: 'https://docs.kodadot.xyz/ambassador-program/ambassador-intro.html#the-opportunity',
      external: true,
    },
    {
      name: this.$t('press kit'),
      url: 'https://github.com/kodadot/kodadot-presskit/tree/main/v3',
      external: true,
    },
  ]

  public socials = [
    {
      name: 'Discord',
      url: 'https://discord.gg/u6ymnbz4PR',
      icon: 'discord',
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
}
</script>
