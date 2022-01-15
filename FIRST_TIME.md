We are using `yarn` workspace, as installing things via npm **will result in broken dependencies.**

# Quick Setup- 🏃‍♀️

Here is a quick setup guide for the project.

```bash
git clone https://github.com/kodadot/nft-gallery.git nft-gallery
cd nft-gallery;
echo 'NUXT_ENV_KEYRING=true
      PINATA_API_KEY=
      PINATA_SECRET_API_KEY=
      PINATA_MASTER=
      SUBSQUID_ENDPOINT=https://app.gc.subsquid.io/beta/rubick/004/graphql' > .env
yarn;yarn dev
```

Open http://localhost:9090

## Docker-🐳
If you just want to try out our KodaDot on Kusama and have a full local setup with a local node, we assume you have [docker](https://docs.docker.com/get-docker/) and docker-compose installed.

- ### First time setup

  - Build the docker image

    ```bash
    # Make sure you are logged into docker.

    docker-compose up --build
    ```

  - To check if container is up:
    ```bash
    docker ps
    ```

- ### From next time

  Simply run:

    ```bash
    docker-compose up
    ```

Voila! KodaDot will be available at [localhost:9090](http://localhost:9090).
KodaDot supports Hot Module Replacement on docker as well, any changes made will take effect immediately.

## Dev hints

In order to execute some transaction you can use `exec` located in `src/utils/transactionExecutor.ts`
Usage:
```js
import exec from '@/utils/transactionExecutor';

// arguments: from which account, password for account, which action, array of parameters
this.tx = await exec(this.account, this.password, api.tx.democracy.vote, [referendumId, { aye, conviction }]);
```

#### Using reactive properties
Some of the properties on the component needs to be automatically updated (currentBlock)

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

 
     
[You can obtain some Westend (WND)](https://matrix.to/#/#westend_faucet:matrix.org)

To change the network go to the `/settings` and change the prefix.
Currently supported networks are `kusama, westend, statemine, westmint`.
Wanna add more networks? [Open an PR on vue-settings](https://github.com/vue-polkadot/ui)

#### Install netlify CLI

```bash
npm install -g netlify-cli
```

#### Install dependencies

```bash
yarn
```

#### Run the development server

```bash
netlify dev
```

The whole stack will be running on `localhost:9000`. app is running on `localhost:9090`.

## Running local Polkadot and subquery nodes

To run the full local environment we recommend you to run a [polkadot/Kusama node](https://github.com/paritytech/polkadot).
In case you are using Apple M1, we have a [tutorial for that 🍏 ](https://vikiival.medium.com/run-substrate-on-apple-m1-a2699743fae8)

To run also a subquery indexing node please [check this repo](https://github.com/vikiival/magick)


### Linting code
#### Show all problems
```bash
yarn lint
```
#### Show only errors
```bash
yarn lint --quiet
```
#### Fix errors
```bash
yarn lint --fix
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
Some of the properties on the component needs to be automatically updated (currentBlock)

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


### Generating changelog

To generate changelog use github cli
List only merged, if you need limit use `-L`

```
gh pr list -s merged --json mergedAt,baseRefName,number,title,headRefName -B main -L 37 | jq -r '.[] | .number, .title' | sed '/^[0-9]/{N; s/\n/ /;}'
```

Love PermaFrost 👀
