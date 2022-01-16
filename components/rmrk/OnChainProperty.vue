<template>
  <div class="d-flex flex-row">
    <span v-for="(item, index) in icons" :key="index">
      <b-tooltip class="p-2" :label="icons[index].label" position="is-top">
        <b-icon
          v-if="icons[index].icon !== 'twitter'"
          v-clipboard:copy="icons[index].label"
          class="property"
          :size="icons[index].size"
          :pack="icons[index].pack"
          :icon="icons[index].icon"
          @click.native="
            icons[index].icon === 'envelope'
              ? openMail(icons[index].label)
              : toast('Copied to clipboard')
          "
        />
        <b-icon
          v-else
          class="property"
          :size="icons[index].size"
          :pack="icons[index].pack"
          :icon="icons[index].icon"
          @click.native="navigateToTwitter(icons[index].label)"
        />
      </b-tooltip>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';
import shortAddress from '@/utils/shortAddress';

type Property = string | undefined;

const components = {
  // Identity: () => import('@/components/shared/format/Identity.vue'),
};

@Component({ components })
export default class OnChainProperty extends Vue {
  @Prop() public twitter!: string;
  @Prop() public email!: string;
  @Prop() public web!: string;
  @Prop() public riot!: string;
  @Prop() public legal!: string;
  public icons: any = [];
  protected id = '';

  public async created() {
    await this.fetchProfile();
  }

  protected async fetchProfile() {
    this.id = shortAddress(this.$route.params.id);

    this.legalVerified();
    this.emailVerified();
    this.twitterVerified();
    this.webVerified();
    this.riotVerified();
  }

  private verify(content: Property) {
    if (!content || content === this.id) return false;
    return true;
  }

  private emailVerified() {
    if (this.verify(this.email)) {
      this.icons.push({
        label: this.email,
        pack: 'fas',
        icon: 'envelope',
        size: 'is-large',
      });
    }
  }

  private twitterVerified() {
    if (this.verify(this.twitter)) {
      this.icons.push({
        label: this.twitter,
        size: 'is-large',
        pack: 'fab',
        icon: 'twitter',
      });
    }
  }

  private riotVerified() {
    if (this.verify(this.riot)) {
      this.icons.push({
        label: this.riot,
        pack: 'fas',
        icon: 'comment-alt',
        size: 'is-large',
      });
    }
  }

  private webVerified() {
    if (this.verify(this.web)) {
      this.icons.push({
        label: this.web,
        pack: 'fas',
        icon: 'globe',
        size: 'is-large',
      });
    }
  }

  private legalVerified() {
    if (this.verify(this.legal)) {
      this.icons.push({
        label: this.legal,
        pack: 'fas',
        icon: 'user',
        size: 'is-large',
      });
    }
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message);
  }

  public navigateToTwitter(handle: string): void {
    window.open('https://twitter.com/' + handle.replace(/@/, ''), '_blank');
  }

  public openMail(handle: string): void {
    location.href = `mailto:${handle}?subject=I%20like%20your%20Creation%20on%20KodaDot&body=Hey%2C%20I've%20found%20your%20creation%20on%20KodaDot%20interesting.%0D%0ACan%20you%20please%20tell%20me%20more%20about%20it%3F`;
  }

  @Watch('legal')
  async watchLegal(newLegal: string, oldLegal: string) {
    this.legalVerified();
  }

  @Watch('email')
  async watchEmail(newEmail: string, oldEmail: string) {
    this.emailVerified();
  }

  @Watch('twitter')
  async watchTwitter(newTwitter: string, oldTwitter: string) {
    this.twitterVerified();
  }

  @Watch('web')
  async watchWeb(newWeb: string, oldWeb: string) {
    this.webVerified();
  }

  @Watch('riot')
  async watchRiot(newRiot: string, oldRiot: string) {
    this.riotVerified();
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.property {
  color: $primary-light;
  display: flex;
  align-items: flex-start;
}
</style>
