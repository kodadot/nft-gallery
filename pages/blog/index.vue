<template>
  <div class="content">
    <div class="content-headline text-center">
      <h1 class="title is-1 relative z-[1]">
        KodaDot Blog
      </h1>
      <div class="relative z-[1] text-2xl mb-20 font-medium">
        Let’s Explore The NFT Universe
      </div>
      <img
        class="content-headline-cover"
        src="/blog-cover.png"
        alt="KodaDot Blog"
      >
    </div>

    <div
      v-for="post in posts?.featured.slice(0, 1)"
      :key="post.title"
      class="relative z-[1] mb-20 content-list"
    >
      <div
        class="content-list-cover"
        :style="{ backgroundImage: `url(${post.image})` }"
      />

      <div class="content-list-card">
        <div>
          <div class="card-tag">
            • {{ post.tags }}
          </div>
          <p class="title is-4">
            <nuxt-link :to="post._path">
              {{ post.title }}
            </nuxt-link>
          </p>
          <div class="truncate mb-4">
            {{ post.subtitle }}
          </div>
        </div>

        <div>
          <NeoButton
            :tag="NuxtLink"
            :to="post._path"
            no-shadow
            rounded
            icon="arrow-right-long"
          >
            View Article
          </NeoButton>
        </div>
      </div>
    </div>

    <!-- article section with 2 grid cols -->
    <h2 class="title is-2">
      Tokens
    </h2>
    <div class="content-list-grid content-list-grid-2">
      <nuxt-link
        v-for="post in posts?.tokensPosts.slice(0, 2)"
        :key="post.title"
        class="content-board block"
        :to="post._path"
      >
        <div
          class="content-board-cover"
          :style="{ backgroundImage: `url(${post.image})` }"
        />
        <div class="content-board-text">
          <p class="font-bold">
            {{ post.title }}
          </p>
          <div class="content-board-subtitle">
            {{ post.subtitle }}
          </div>
        </div>
      </nuxt-link>
    </div>

    <!-- article section -->
    <h2 class="title is-2">
      Latest Posts
    </h2>
    <div class="content-list-grid">
      <nuxt-link
        v-for="post in posts?.posts"
        :key="post.title"
        class="content-board block"
        :to="post._path"
      >
        <div
          class="content-board-cover"
          :style="{ backgroundImage: `url(${post.image})` }"
        />
        <div class="content-board-text">
          <p class="font-bold">
            {{ post.title }}
          </p>
          <div class="content-board-subtitle">
            {{ post.subtitle }}
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { resolveComponent } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')
const { data: posts } = useAsyncData('posts', async () => {
  const contents = await queryContent('/').find()
  const tags = {
    tokens: 'Tokens',
  }
  const latestPosts = contents.sort(
    (content_a, content_b) =>
      +new Date(content_b.date) - +new Date(content_a.date),
  )

  const reduce = latestPosts.reduce(
    (acc, post, index) => {
      if (index === 0) {
        acc.featured.push(post)
        return acc
      }
      if (post.tags === tags.tokens) {
        acc.tokensPosts.push(post)
      }
      acc.posts.push(post)
      return acc
    },
    {
      featured: [],
      posts: [],
      tokensPosts: [],
    },
  )

  return reduce
})
</script>
