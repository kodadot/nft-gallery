<template>
  <div class="Landing">
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Welcome to KodaDot 🏛 governance dashboard
          </h1>
          <h2 class="subtitle">
            <a href="https://twitter.com/KodaDot">🐦 Feel free follow us on Twitter @KodaDot</a>
          </h2>

          You can <router-link :to="{ name: 'accounts' }">
          create and manage your accounts</router-link>, 
          <router-link :to="{ name: 'addressbook' }">add contacts</router-link>.

          Then you can <router-link :to="{ name: 'transfer' }">do transfers between accounts</router-link>.<br>

          <router-link :to="{ name: 'democracy' }">Vote and submit proposals</router-link> on your favourite chain.<br>

          More features will come later as they are being 👩‍🍳cooked.
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Landing extends Vue {
  
  @Watch('$store.state.keyringLoaded')
  public operationsAvailable(): void {
    console.log('yup')
  }

  public isKeyringLoaded() {
    return this.$store.state.keyringLoaded;
  }

  public mounted(): void {
    this.isKeyringLoaded();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.subtitle {
  text-decoration: underline;
}
</style>
