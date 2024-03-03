<template>
  <div class="rounded-xl border relative">
    <pre
      class="resolve-issue-code-example !pb-[30px] !my-0 !rounded-xl"
      :class="`language-${lang}`">
    <code>{{ normalizedCode }}</code>
  </pre>
    <div
      v-clipboard:copy="normalizedCode"
      class="absolute border-t bottom-0 w-full text-right rounded-b-xl py-1.5 px-3.5 text-xs cursor-pointer hover:bg-neutral-4 hover:bg-natural-4 dark:hover:bg-neutral-7 dark:hover:bg-natural-10"
      @click="toast($t('general.copyToClipboard'))">
      {{ $t('codeChecker.copyCode') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Prism from 'prismjs'
import Normalizer from 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'

const nw = new Normalizer({
  'remove-trailing': true,
  'right-trim': true,
})

const props = defineProps<{ code: string; lang: string }>()
const normalizedCode = computed(() => nw.normalize(props.code))

const { toast } = useToast()

onMounted(() => {
  const codeBlock = document.querySelector('.resolve-issue-code-example')

  if (codeBlock) {
    Prism.highlightElement(codeBlock)

    // prevent Bulma's global styles from overriding styling of elements with `.tag` class
    if (props.lang === 'markup') {
      Array.from(codeBlock.querySelectorAll('.tag')).forEach((t) => {
        t.classList.remove('tag')
        t.classList.add('text-red-800', 'dark:text-rose-400')
      })
    }
  }
})
</script>
