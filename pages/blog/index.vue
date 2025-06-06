<template>
  <div class="content">
    <div class="content-headline text-center">
      <h1 class="title is-1 relative z-1 text-text-color-inverse! text-shadow-border">
        KodaDot Blog
      </h1>
      <div class="relative z-1 text-2xl mb-20 font-medium">
        Let's Explore The NFT Universe
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
      class="relative z-1 mb-20 content-list"
    >
      <div
        class="content-list-cover"
        :style="{ backgroundImage: `url(${post.meta?.image})` }"
      />

      <div class="content-list-card">
        <div>
          <div class="card-tag">
            • {{ post.meta?.tags }}
          </div>
          <p class="title is-4">
            <nuxt-link :to="post.path">
              {{ post.title }}
            </nuxt-link>
          </p>
          <div class="truncate mb-4">
            {{ post.meta?.subtitle }}
          </div>
        </div>

        <div>
          <NeoButton
            :tag="NuxtLink"
            :to="post.path"
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
        :to="post.path"
      >
        <div
          class="content-board-cover"
          :style="{ backgroundImage: `url(${post.meta?.image})` }"
        />
        <div class="content-board-text">
          <p class="font-bold">
            {{ post.title }}
          </p>
          <div class="content-board-subtitle">
            {{ post.meta?.subtitle }}
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
        :to="post.path"
      >
        <div
          class="content-board-cover"
          :style="{ backgroundImage: `url(${post.meta?.image})` }"
        />
        <div class="content-board-text">
          <p class="font-bold">
            {{ post.title }}
          </p>
          <div class="content-board-subtitle">
            {{ post.meta?.subtitle }}
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
  const tags = { tokens: 'Tokens' }
  const contents = await queryCollection('blog').all()
  const latestPosts = contents?.sort(
    (content_a, content_b) =>
      +new Date(content_b?.meta?.date) - +new Date(content_a?.meta?.date),
  )

  const reduce = latestPosts?.reduce(
    (acc, post, index) => {
      if (index === 0) {
        acc.featured.push(post)
        return acc
      }
      if (post.meta?.tags === tags.tokens) {
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

<style lang="scss">
@import '@/assets/styles/abstracts/mixins';

.content {
  margin: 0 auto;
  max-width: 60rem;

  &-headline {
    &-cover {
      position: absolute;
      top: -100%;
      left: 50%;
      transform: translateX(-50%);
      height: 25rem;
    }

    h1 {
      letter-spacing: -0.02em;
    }

    @include bulma-touch {
      h1 {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
        margin-bottom: 2.5rem;
      }
    }
  }

  &-board {
    border-radius: 1rem;
    overflow: hidden;

    &-cover {
      border-bottom: 1px solid var(--card-border-color);
    }

    border: 1px solid var(--card-border-color);
    background-color: var(--background-color);

    &:hover {
      border-color: var(--border-color);

      p,
      div {
        color: var(--text-color);
      }

      .content-board-cover {
        opacity: var(--card-hover-opacity);
      }
    }

    &-cover {
      background-size: cover;
      background-position: center;
      height: 8rem;
    }

    &-text {
      padding: 1rem;
    }

    &-subtitle {
      max-width: 300px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &-list {
    overflow: hidden;
    display: flex;
    height: 22rem;
    border-radius: 2.5rem;

    @include bulma-touch {
      height: auto;
    }

    &-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-gap: 1.5rem;
      margin-bottom: 1.5rem;

      &-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));

        .content-board-cover {
          height: 14rem;
        }
      }

      @media (max-width: 769px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @media (max-width: 426px) {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
    }

    &-cover {
      background-size: cover;
      background-position: center;
      width: 40rem;
      max-height: 22rem;
    }

    &-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem;
      width: 20rem;

      .card-tag {
        color: var(--k-grey-fix);
      }

      .truncate {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
      }
    }

    background-color: var(--k-white);
    border: 1px solid var(--border-color);
    box-shadow: 4px 4px 0px 0px var(--border-color);

    &-cover {
      border-right: 1px solid var(--border-color);
    }

    @include bulma-touch {
      flex-direction: column;

      &-cover {
        border-right: none !important;
        height: 20rem;
        width: 100%;
      }

      &-card {
        &-title {
          font-size: 1.5rem;
        }
      }

      .o-btn {
        margin-top: 1rem;
      }
    }
  }
}
</style>
