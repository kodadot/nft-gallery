<template>
	<div v-if="!hasDisplayedCookieBanner">
		<transition name="slide">
			<div class="notices is-bottom">
				<div
					role="alertdialog"
					class="snackbar is-success is-bottom-right"
				>
					<div class="text">{{ $t('cookies.notice') }}</div>
					<div class="action is-light is-cancel">
						<button class="button" @click="declineCookies">{{ $t('cookies.decline') }}</button>
					</div>
					<div class="action is-success">
						<button class="button" @click="acceptCookies">{{ $t('cookies.accept') }}</button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition: opacity 0.5s;
}
.slide-enter,
.slide-leave-to {
	opacity: 0;
}
</style>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'

export default class CookieBanner extends Vue {
  protected hasDisplayedCookieBanner: boolean = localStorage.getItem('cookies_enabled') !== null || false

  public acceptCookies(): void {
    this.$ga.enable()
    this.hasDisplayedCookieBanner = true
    localStorage.setItem('cookies_enabled', '1')
  }

  public declineCookies(): void {
    this.$ga.disable()
    this.hasDisplayedCookieBanner = true
    localStorage.setItem('cookies_enabled', '0')
  }
}
</script>
