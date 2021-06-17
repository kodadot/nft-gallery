# dashboard

# 🏃‍♀️ Quick Setup

```bash
git clone https://github.com/kodadot/nft-gallery.git
cd nft-gallery/dashboard
touch .env.local
```

in `.env.local` add folloving urls:
```bash
VUE_APP_KEYRING=true
VUE_APP_I18N_LOCALE=en
VUE_APP_I18N_FALLBACK_LOCALE=en
VUE_APP_SLATE_KEY=
VUE_APP_SUBQUERY_URL=https://api.subquery.network/sq/vikiival/magick
```
you can obtain api key for slate [here](slate.host)

> to run UI

```bash
cd nft-gallery/dashboard
yarn
yarn start
```

> in a second terminal window:
> this will run lambda functions

```bash
cd nft-gallery/dashboard
yarn lambda
```

## Running local Polkadot and subquery nodes

To run the full local environment we recommend you to run a [polkadot/Kusama node](https://github.com/paritytech/polkadot).
In case you are using Apple M1, we have a [tutorial for that 🍏 ](https://vikiival.medium.com/run-substrate-on-apple-m1-a2699743fae8)

To run also a subquery indexing node please [check this repo](https://github.com/vikiival/magick)

Moreover please add this to your `.env.local`

```bash
VUE_APP_SUBQUERY_URL=http://localhost:3000
```

### Lints and fixes files
```
yarn run lint
```

### Dev hints

In order to execute some transaction you can use `exec` located in `src/utils/transactionExecutor.ts`
Usage:
```js
import exec from '@/utils/transactionExecutor';

// arguments: from which account, password for account, which action, array of parameters
this.tx = await exec(this.account, this.password, api.tx.democracy.vote, [referendumId, { aye, conviction }]);
```

#### Using reactive properties
Some of the properies on the component needs to be automatically updated (currentBlock)

Usage:
```html
<template>
  <div>{{ currentBlock  }}</div>
</template>

<script lang="ts">
// Skipping imports
export default class Summary extends Vue {
  private currentBlock: any = {};
  private subs: any[] = [];

  public async mounted() {
    this.subs.push(await api.derive.chain.bestNumber(value => this.currentBlock = value));
  }

  // Unsubscribe before destroying component
  public beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}

</script>
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
