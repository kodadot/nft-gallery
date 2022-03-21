<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <Navbar />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-half">
              <Nuxt />
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>
