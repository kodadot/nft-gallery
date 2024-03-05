<template>
  <div>
    <pre
      class="resolve-issue-code-example border border-border-color !pb-[30px] !my-0 !rounded-t-xl !rounded-b-none !bg-neutral-2 dark:!bg-neutral-10"
      :class="`language-${lang}`"
      v-html="highlightedCode" />

    <div
      v-clipboard:copy="normalizedCode"
      class="bottom-0 w-full text-right border border-t-0 rounded-b-xl py-1.5 px-3.5 text-xs cursor-pointer bg-neutral-2 hover:bg-neutral-4 dark:bg-neutral-10 dark:hover:bg-neutral-8"
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
const highlightedCode = computed(() =>
  Prism.highlight(
    normalizedCode.value,
    Prism.languages[props.lang],
    props.lang,
  ),
)

const { toast } = useToast()

onMounted(() => {
  const codeBlock = document.querySelector('.resolve-issue-code-example')
  if (codeBlock && props.lang === 'markup') {
    // prevent Bulma's global styles from overriding styling of elements with `.tag` class
    Array.from(codeBlock.querySelectorAll('.tag')).forEach((t) => {
      t.classList.remove('tag')
      t.classList.add('text-red-800', 'dark:text-rose-400')
    })
  }
})
</script>
