<template>
  <footer class="footer">
    <LazyCookieBanner />
    <LazyModalsKeyboardShortcutsModal />
    <div class="container footer__wrapper">
      <div class="icons">
        <ul class="footer__list icons__list">
          <li class="icons__list-item">
            <a
              href="https://discord.gg/u6ymnbz4PR"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord">
              <b-icon pack="fab" icon="discord" size="is-medium" />
            </a>
          </li>
          <li class="icons__list-item">
            <a
              href="https://twitter.com/KodaDot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter">
              <b-icon pack="fab" icon="twitter" size="is-medium" />
            </a>
          </li>
          <li class="icons__list-item">
            <a
              href="https://instagram.com/kodadot.xyz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram">
              <b-icon pack="fab" icon="instagram" size="is-medium" />
            </a>
          </li>
          <li class="icons__list-item">
            <a
              href="https://www.youtube.com/channel/UCEULduld5NrqOL49k1KVjoA/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Youtube">
              <b-icon pack="fab" icon="youtube" size="is-medium" />
            </a>
          </li>
          <li class="icons__list-item">
            <a
              href="https://medium.com/kodadot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Medium">
              <b-icon pack="fab" icon="medium" size="is-medium" />
            </a>
          </li>
        </ul>
      </div>
      <ul class="footer__list">
        <li v-for="item in menu" :key="item.url" class="footer__list-item">
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
    {
      name: this.$t('qrCode'),
      url: '/qrCode',
    },
  ]
}
</script>
