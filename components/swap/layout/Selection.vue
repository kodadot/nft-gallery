<template>
  <SwapLayout>
    <template #title>
      <slot name="title" />
    </template>

    <div class="columns">
      <div class="column">
        <hr class="mb-6 mt-0">

        <slot />
      </div>
      <div class="column is-narrow">
        <slot name="preview" />
      </div>
    </div>
  </SwapLayout>
</template>
