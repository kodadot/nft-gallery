# Setting up your Local Environment

We are using a `pnpm` workspace, installing things via npm **will result in broken dependencies.**


## Prerequisites
You're using a version of node that's on/after version 16.13.2

- Install node by visiting [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

You have pnpm installed.

- You can install pnpm by running in your terminal
```MD
npm install -g pnpm
```

## Installation
1) Fork our [Repository](https://github.com/kodadot/nft-gallery)
2) Go to the forked repo and click the green "Code" button
3) Copy the HTTPS link (i.e https://github.com/your-username/nft-gallery.git)
4) Go to your IDE and open the terminal
5) Type in the terminal "git clone your-HTTPS-link".

For example,
```bash
git clone https://github.com/your-username/nft-gallery.git
```
6) Then paste these two commands in the terminal
```bash
cd nft-gallery;
pnpm i;
```
If you come across
ERR_PNPM_UNSUPPORTED_ENGINE  Unsupported environment (bad pnpm and/or Node.js version), run

```bash
nvm use 16
```

7) Lastly, start the server by running

```bash
pnpm dev
```

**KodaDot will be available at [localhost:9090](http://localhost:9090).**

## Starting localhost with pinning functionality

If you want to use the pinning functionality, you must create a `.env` file in your project root.

Copy and paste the following:

```bash
echo 'NUXT_ENV_KEYRING=true
      PINATA_API_KEY=
      PINATA_SECRET_API_KEY=
      PINATA_MASTER=' > .env
```

**You can obtain Master Pinata Keys [here](https://app.pinata.cloud/keys)**

Install the netlify-cli by running this in your terminal:

```bash
npm install netlify-cli -g
```

Start the server by running:
```bash
netlify dev
```

**Dev server will start on [localhost:9000](http://localhost:9000).**
You can find all the functions in `src-functions/`

## Using KodaDot on Kusama

If you just want to try out our KodaDot on Kusama, you must have [Docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) installed to have a local setup and node.

### Installation

1) Build the docker image

    ```bash
    docker-compose up --build
    ```

2) Check if the container is up:
    ```bash
    docker ps
    ```

3) Run:
  ```bash
  docker-compose up
  ```

KodaDot will be available at [localhost:9090](http://localhost:9090).

KodaDot supports Hot Module Replacement on Docker; any changes made will take effect immediately.



## Running local Polkadot and Subquery nodes

To run the complete local environment, we recommend running a [Polkadot/Kusama node](https://github.com/paritytech/polkadot).
In case you are using Apple M1, we have a [tutorial for that 🍏 ](https://vikiival.medium.com/run-substrate-on-apple-m1-a2699743fae8)

Current Indexers we have/use:

- SubSquid
  - RMRK: [rubick](https://github.com/kodadot/rubick)
- SubQuery
  - RMRK: [magick](https://github.com/vikiival/magick)
  - Statemine (Unique NFT pallet): [unique](https://github.com/kodadot/unique)

## Checking your code

#### Linting code

**Show all problems**

```bash
yarn lint
```

**Show only errors**

```bash
yarn lint --quiet
```

**Fix errors**

```bash
yarn lint --fix
```

#### Generating changelog

To generate a changelog, use GitHub CLI
List only merged

If you need limit, use `-L`

```bash
gh pr list -s merged --json mergedAt,baseRefName,number,title,headRefName -B main -L 37 | jq -r '.[] | .number, .title' | sed '/^[0-9]/{N; s/\n/ /;}'
```


## Troubleshooting

#### **How can I resolve conflict on yarn.lock?**

> CONFLICT (content): Merge conflict in yarn.lock

When you see conflict on `yarn.lock` and you are on your pull-request branch, merge upstream branch and run `yarn`, unless you have conflict on `package.json`, that requires manual resolve.

```bash
git fetch --all
git merge origin/main
yarn
```

#### **How can I read some data from the GraphQL?**

Every `.graphql` file is located in the `src/queries/`.

```graphql
query nftByIdMinimal($id: String!) {
  nFTEntity(id: $id) {
    id
    currentOwner
    price
  }
}
```

To use it inside the `.vue` file, we can import it like a regular module:
For specific purposes, we also need to import the `PrefixMixin`. Thanks to that app, know which indexer is using.

> PrefixMixin is only applicable to the SubQuery indexers. To use SubSquid, please use client: 'subsquid' in the query call.

Then we can use it like this:

```html
<script lang="ts">
  import { Component, mixins } from "nuxt-property-decorator"

  import nftByIdMinimal from "@/queries/nftByIdMinimal.graphql"
  import PrefixMixin from "~/utils/mixins/prefixMixin"

  @Component({})
  export default class GalleryItem extends mixins(PrefixMixin) {
    id: string = ""
    nft: NFT = emptyObject<NFT>()

    async fetch() {
      const { data } = await this.$apollo.query({
        client: this.urlPrefix,
        query: nftByIdMinimal,
        variables: { id: this.id },
      })

      this.nft = data.nFTEntity
      console.log("nft", this.nft)
    }
  }
</script>
```

#### **How can I read on-chain data from the RPC node?**

```html
<script lang="ts">
  import { Component, Vue } from "nuxt-property-decorator"
  import Connector from "@kodadot1/sub-api"

  @Component({})
  export default class GalleryItem extends Vue {
    id = "0"
    collectionId = "0"

    async fetch() {
      const { api } = Connector.getInstance()
      const nft = await api.query.uniques.asset(this.collectionId, this.id)
      console.log("nft", nft)
    }
  }
</script>
```

#### **Is it possible to subscribe to the on-chain data from the RPC node?**

```html
<script lang="ts">
  import { Component, mixins } from "nuxt-property-decorator"
  import SubscribeMixin from "@/utils/mixins/subscribeMixin"

  @Component({})
  export default class GalleryItem extends mixins(SubscribeMixin) {
    id = "0"
    collectionId = "0"

    async created() {
      this.subscribe(
        api.query.uniques.asset,
        [this.collectionId, this.id],
        (nft: any) => console.log(nft) // callback which returns the data
      )
    }
  }
</script>
```

#### **How can I make an on-chain transaction?**
```html
<script lang="ts">
  import { Component, mixins } from "nuxt-property-decorator"
  import MetaTransactionMixin from "@/utils/mixins/metaMixin"
  // import AuthMixin from '~/utils/mixins/authMixin' // get currently logged in account

  import Connector from "@kodadot1/sub-api"

  @Component({})
  export default class GalleryItem extends mixins(MetaTransactionMixin) {
    async submit() {
      const cb = api.tx.system.remark
      const args = "Hello World"

      await this.howAboutToExecute(
        this.accountId, // sender can be obtained from the AuthMixin
        cb,
        [args],
        (blockNumber) =>
          console.log(`Remark ${args} saved in block ${blockNumber}`)
      )
    }
  }
</script>
```

#### **How can I test Kodadot without spending KSM?**

[You can obtain some Westend (WND)](https://matrix.to/#/#westend_faucet:matrix.org)

You can change the network in the navbar.
Currently supported networks are `Kusama, Westend, statemine, westmint`.
Do you want to add more networks? [Open a PR on vuex-options](https://github.com/kodadot/packages)




## Notice for contributors before 15/01/2022

If you've forked nft-gallery before **15/01/2022**, you have an older fork that doesn't include our newest additions.

There's two ways you can work around this:

1) [Re-forking](https://docs.github.com/en/repositories/creating-and-managing-repositories/deleting-a-repository)
2) [Syncing your fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

Learn more about these issues here:

- [Issue 1845](https://github.com/kodadot/nft-gallery/issues/1845)
- [Issue 1844](https://github.com/kodadot/nft-gallery/issues/1844)

