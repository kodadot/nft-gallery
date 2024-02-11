<template>
  <div class="flex flex-wrap">
    <div class="w-1/2 p-4 flex flex-col gap-10">
      <!-- Content of the first column -->
      <div class="">
        <h1 class="title is-3 mb-4">Code Checker</h1>
        <div class="w-2/3">
          Effortlessly validate your generative art code. Drop your file, check
          for essentials, and optimize. Preview, iterate, and finalize with
          confidence. Start now.
        </div>
      </div>

      <div class="py-4 px-5 border border-neutral-5">
        <h2 class="mb-3">Resources:</h2>
        <div class="pl-3 flex flex-col gap-3">
          <a
            v-safe-href="'https://hello.kodadot.xyz/tutorial/generative-art'"
            class="flex items-center w-fit"
            target="_blank"
            rel="nofollow noopener noreferrer">
            <div
              class="text-k-blue hover:text-k-blue-hover flex items-center mr-2">
              <NeoIcon icon="circle" pack="fas" class="text-[4px] mr-2" />
              Kodahash Template
            </div>
            <NeoIcon icon="arrow-up-right" class="text-neutral-7 text-[14px]" />
          </a>

          <a
            v-safe-href="'https://github.com/vikiival/kodahash'"
            class="flex items-center w-fit"
            target="_blank"
            rel="nofollow noopener noreferrer">
            <div
              class="text-k-blue hover:text-k-blue-hover flex items-center mr-2">
              <NeoIcon icon="circle" pack="fas" class="text-[4px] mr-2" />
              Learn about generative art on Kodadot
            </div>
            <NeoIcon icon="arrow-up-right" class="text-neutral-7 text-[14px]" />
          </a>
        </div>
      </div>

      <div class="w-2/3">
        <h2 class="mb-3 title is-4">Upload Your Code</h2>
        <p class="mb-4">
          Drop your code file here or click to select, and initiate the
          automated review.
        </p>
        <transition name="fade">
          <NeoUpload
            v-model="selectedFile"
            drag-drop
            native
            expanded
            accept=".zip"
            @update:modelValue="onFileSelected">
            <div>
              <div
                v-if="!selectedFile"
                class="flex flex-col items-center limit-width gap-2 py-5">
                <NeoIcon
                  icon="arrow-down-to-bracket"
                  class="text-xl text-k-grey" />

                <span
                  >Drag Your
                  <b class="mr-1">.Zip File</b>
                  Here Or Click To Select
                </span>
                <span class="text-k-grey"
                  >supported formats: .js, .frag, .vert
                </span>
              </div>
              <img v-else-if="loading" src="/preloader.svg" width="200" />
              <div v-else class="flex justify-between items-center">
                <div class="flex items-top">
                  <NeoIcon
                    icon="code"
                    class="border py-3 px-[10px] rounded-full mr-4 h-fit" />
                  <div class="flex flex-col gap-3 justify-start">
                    <span>SuperIncode.js</span>
                    <div
                      class="flex justify-between items-center text-xs gap-4">
                      <span>status:</span>
                      <span class="text-k-green">
                        <NeoIcon icon="check" class="text-lg mr-1" />
                        <span>code added</span>
                      </span>
                    </div>
                  </div>
                </div>
                <NeoButton
                  class="text-neutral-7"
                  variant="text"
                  no-shadow
                  icon="xmark"
                  size="medium"
                  @click="selectedFile = null" />
              </div>
            </div>
          </NeoUpload>
        </transition>
      </div>

      <div class="">
        <h2 class="mb-3 title is-4">Code Validation</h2>
        <p v-if="!selectedFile" class="text-neutral-7">
          upload code to continue
        </p>
      </div>
    </div>

    <div class="w-1/2">
      <!-- Content of the second column -->
      <div class="bg-blue-200 p-4">Column 2</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon, NeoUpload } from '@kodadot1/brick'
const selectedFile = ref<File | null>(null)
</script>
