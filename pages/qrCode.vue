<template>
  <div class="columns is-multiline">
    <div
      v-for="item in qrCodeList"
      :key="item.title"
      class="column is-half has-text-centered mb-3">
      <a v-safe-href="item.link">{{ item.title }}</a>
      <img :src="item.img" class="is-half px-8 mt-2" :alt="item.title" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'QrCodePage',
  setup() {
    useHead({
      title: 'Connect with KodaDot: Quick-Access QR Codes',
      meta: [
        {
          name: 'description',
          content:
            'Scan to connect with KodaDot instantly! From Discord to Instagram, get quick access to our community and projects through these QR codes.',
        },
      ],
    })
  },
  data() {
    const qrCodeList = [
      {
        title: 'Discord',
        img: '/qrCode/discord.png',
        link: 'https://discord.gg/u6ymnbz4PR',
      },
      {
        title: 'Twitter',
        img: '/qrCode/twitter.png',
        link: 'https://twitter.com/KodaDot',
      },
      {
        title: 'Github',
        img: '/qrCode/github.png',
        link: 'https://github.com/kodadot/nft-gallery',
      },
      {
        title: 'Instagram',
        img: '/qrCode/instagram.png',
        link: 'https://instagram.com/kodadot.xyz',
      },
    ]
    return {
      qrCodeList,
    }
  },
}
</script>
