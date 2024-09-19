<template>
  <div class="min-h-full flex flex-col is-clipped">
    <Navbar />

    <main class="flex-grow">
      <NuxtPage />
    </main>
    <LazyCookieBanner />
    <KeyboardShortcutsModal />
    <Buy />
    <ListingCartModal />
  </div>
</template>
