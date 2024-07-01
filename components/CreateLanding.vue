<template>
  <BackablePage :title="$t('createPlaceholder.welcome')">
    <div class="flex flex-col gap-4">
      <p class="capitalize">{{ $t('createPlaceholder.ourFocus') }}</p>

      <div class="flex">
        <p class="capitalize">
          {{ $t('createPlaceholder.intersted') }}
          <a
            href="https://form.kodadot.xyz/drop-interest"
            class="text-k-blue hover:text-k-blue-hover"
            target="_blank"
            rel="nofollow noopener noreferrer">
            {{ $t('createPlaceholder.fillOut') }}
          </a>
          {{ $t('createPlaceholder.learnMore') }}
        </p>
      </div>

      <p class="capitalize">
        {{ $t('createPlaceholder.codeStructure') }}

        <a
          href="https://hello.kodadot.xyz/generative/generative-art"
          class="text-k-blue hover:text-k-blue-hover"
          target="_blank"
          rel="nofollow noopener noreferrer">
          {{ $t('documentation') }}
        </a>
      </p>
    </div>
  </BackablePage>
</template>
