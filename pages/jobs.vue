<template>
  <section class="section">
    <div class="container">
      <div v-for="job in jobPostings" :key="job.headline" class="mb-5">
        <h2 class="heading heading-is-5 is-size-2-mobile text-bold">
          {{ job.headline }}
          <span class="text__stroked heading heading-is-7 is-size-1-mobile">{{ job.subheadline }}</span>
        </h2>
        <p class="max-w-600">{{ job.description }}</p>
        <b-button
          tag="a"
          :href="job.url"
          target="_blank"
          rel="noopener noreferrer"
          type="my-5 is-primary"
        >
          Learn More
        </b-button>
      </div>
   </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'full-width-layout'
})
export default class Jobs extends Vue {
  private jobPostings = [
    {
      headline: 'Frontend Developer',
      subheadline: 'Typescript',
      description: 'Are you good in VueJS and Typescript? We want to hear from you!',
      url: 'https://cryptojobslist.com/jobs/vuejs-frontend-engineer-at-nft-gallery-on-kusama-polkadot-at-metaprime-kodadot-berlin'
    },
    {
      headline: 'Technical Product',
      subheadline: 'Manager',
      description: 'Are you skilled managing pull request and linking issues? We want to hear from you!',
      url: 'https://cryptojobslist.com/jobs/technical-product-manager-at-metaprime-kodadot-berlin'
    },
    {
      headline: 'Rust Developer',
      subheadline: 'Substrate',
      description: 'Are you familiar with Rust and Substrate? We want to hear from you!',
      url: 'https://discord.gg/35hzy2dXXh'
    },
    {
      headline: 'Chief Operating',
      subheadline: 'Officer',
      description: 'Are you good with day to day operations? You should be high-performance and have a passion for Open Metaverse. Athlete in the crypto space.',
      url: 'https://cryptojobslist.com/jobs/senior-business-and-operations-manager-at-metaprime-berlin'
    },
    {
      headline: 'UI/UX',
      subheadline: 'Designer',
      description: 'Are you good with atomic components? We want to hear from you!',
      url: 'https://discord.gg/35hzy2dXXh'
    },
    {
      headline: 'Community Discord',
      subheadline: 'Manager',
      description: 'Are you good with managing the community? We want to hear from you!',
      url: 'https://discord.gg/35hzy2dXXh'
    },
    {
      headline: 'Senior Business & Operations',
      subheadline: 'Manager',
      description: 'Are you good with day to day operations? We want to hear from you!',
      url: 'https://cryptojobslist.com/jobs/senior-business-and-operations-manager-at-metaprime-berlin'
    },
    {
      headline: 'Developer',
      subheadline: 'Advocate',
      description: 'We need you to help us with incoming developers, creating tutorials for developers on how to hack on our stuff, making streamlined flow when bugs occur and the rest of the greatly known avocados. Making good demos. Being an english-native speaker is highly needed for a lot of educational videos.',
      url: 'https://discord.gg/35hzy2dXXh'
    },
    {
      headline: 'Technical',
      subheadline: 'Writer',
      description: 'Creating technical writings to help better understand what we are doing with KodaDot and Metaprime.',
      url: 'https://discord.gg/35hzy2dXXh'
    }
  ]
}
</script>