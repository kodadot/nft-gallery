<template>
  <div class="min-h-full flex flex-col overflow-hidden">
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
