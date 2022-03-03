We are using a `yarn` workspace, as installing things via npm **will result in broken dependencies.**

> If you want to know how KodaDot works, go to the [DOCS](https://docs.kodadot.xyz/).

# Hyper start 🚀

### Prerequisites 🎒

```MD
node >=16.14.0
yarn 🧶
```

Copy and paste these commands to your terminal:

```bash
git clone https://github.com/kodadot/nft-gallery.git nft-gallery
cd nft-gallery;
yarn;
```

It will clone your project and install all dependencies.

to start the server, run:

```bash
yarn dev
```

**KodaDot will be available at [localhost:9090](http://localhost:9090).**

### Starting dev server with the pinning functionality 📦

If you want to use the pinning functionality, you must create a `.env` file in your project root.

```bash
echo 'NUXT_ENV_KEYRING=true
      PINATA_API_KEY=
      PINATA_SECRET_API_KEY=
      PINATA_MASTER=' > .env
```

Functions are located in `src-functions/`

**[You can obtain Master Pinata Keys here](https://app.pinata.cloud/keys)**

you need to install the netlify-cli:

```bash
npm install netlify-cli -g
```

to start the server, run:

```bash
netlify dev
```

**App will start on [localhost:9000](http://localhost:9000).**

# ⚠️ Notice for contributors before 15/01/2022 ⚠️

If you've had contributed before **15/01/2022 and have an older fork of** `nft-gallery`, there are currently two strategies to be up-to-date.

- Easiest - [Delete your fork and fork it as new.](https://docs.github.com/en/repositories/creating-and-managing-repositories/deleting-a-repository)
- Harder - [Sync your fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

### Ref

- https://github.com/kodadot/nft-gallery/issues/1845
- https://github.com/kodadot/nft-gallery/issues/1844

## Docker 🐳

If you just want to try out our KodaDot on Kusama and have a complete local set up with a local node, we assume you have [docker](https://docs.docker.com/get-docker/) and docker-compose installed.

- ### First time setup

  - Build the docker image

    ```bash
    # Make sure you are logged into docker.

    docker-compose up --build
    ```

  - To check if the container is up:
    ```bash
    docker ps
    ```

- ### From next time

  Run:

  ```bash
  docker-compose up
  ```

Voila! KodaDot will be available at [localhost:9090](http://localhost:9090).
KodaDot supports Hot Module Replacement on docker; any changes made will take effect immediately.

## Dev hacks (FAQ) 🦇

**0. How can I resolve conflict on yarn.lock?**

> CONFLICT (content): Merge conflict in yarn.lock

When you see conflict on `yarn.lock` and you are on your pull-request branch, merge upstream branch and run `yarn`, unless you have conflict on `package.json`, that requires manual resolve.

```bash
git fetch --all
git merge origin/main
yarn
```

**1. How can I read some data from the GraphQL?**

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

**2. How can I read on-chain data from the RPC node?**

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

**3. Is it possible to subscribe to the on-chain data from the RPC node?**

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

**4. How can I make an on-chain transaction?**
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

**5. How can I test Kodadot without spending KSM?**

[You can obtain some Westend (WND)](https://matrix.to/#/#westend_faucet:matrix.org)

You can change the network in the navbar.
Currently supported networks are `Kusama, Westend, statemine, westmint`.
Do you want to add more networks? [Open a PR on vuex-options](https://github.com/kodadot/packages)

## Running local Polkadot and subquery nodes

To run the complete local environment, we recommend running a [polkadot/Kusama node](https://github.com/paritytech/polkadot).
In case you are using Apple M1, we have a [tutorial for that 🍏 ](https://vikiival.medium.com/run-substrate-on-apple-m1-a2699743fae8)

Current Indexers we have/use:

- SubSquid
  - RMRK: [rubick](https://github.com/kodadot/rubick)
- SubQuery
  - RMRK: [magick](https://github.com/vikiival/magick)
  - Statemine (Unique NFT pallet): [unique](https://github.com/kodadot/unique)

### MISC 🏞

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

To generate changelog, use GitHub CLI
List only merged; if you need limit, use `-L`

```bash
gh pr list -s merged --json mergedAt,baseRefName,number,title,headRefName -B main -L 37 | jq -r '.[] | .number, .title' | sed '/^[0-9]/{N; s/\n/ /;}'
```
