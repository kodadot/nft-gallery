<template>
	<b-dropdown
				:mobile-modal="false" aria-role="list">
				<button class="button is-primary" type="button" slot="trigger">

					<template >
						<b-icon icon="users"></b-icon>
						<span>Seconds ({{ accounts.length }})</span>
					</template>
					<b-icon icon="caret-down"></b-icon>
				</button>
				<template v-if="accounts">
				<b-dropdown-item aria-role="listitem"
					v-for="(acc, index) in accounts"
					v-bind:key="index"
					v-bind:value="acc.toString()">
					<div class="media">
						<b-icon class="media-left" icon="users">
						</b-icon>
						<div class="media-content">
							<h3>Second {{ index }}</h3>
							<small>{{ acc.toString().substring(0, 4) }}</small>
						</div>
					</div>
				</b-dropdown-item>
				</template>
			</b-dropdown>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';

@Component
export default class Seconds extends Vue {
	@Prop({ default: [] }) public accounts!: any[];

} 
</script>
