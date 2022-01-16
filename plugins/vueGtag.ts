import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ app }) => {
  Vue.use(VueGtag, {
    config: { id: app.$config.googleAnalyticsId },
    enable: true,
  });
};
