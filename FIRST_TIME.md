We are using a `pnpm` workspace, as installing things via npm **will result in broken dependencies.**

> If you want to know how KodaDot works, go to the [DOCS](https://docs.kodadot.xyz/).

# Hyper start 🚀

### Prerequisites 🎒

```MD
node >=16.14.0
pnpm
```

Copy and paste these commands to your terminal:

```bash
git clone https://github.com/kodadot/nft-gallery.git nft-gallery
cd nft-gallery;
pnpm i;
```

It will clone your project and install all dependencies.

to start the server, run:

```bash
pnpm dev
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

## Docker 🐳

If you just want to try out our KodaDot on Kusama and have a complete local set up with a local node, we assume you have [docker](https://docs.docker.com/get-docker/) and docker-compose installed.

### First time setup

- Build the docker image
```bash
# Make sure you are logged into docker.
docker-compose up --build
```

- To check if the container is up:
```bash
docker ps
```

### From next time

Run:
```bash
docker-compose up
```

Voila! KodaDot will be available at [localhost:9090](http://localhost:9090).
KodaDot supports Hot Module Replacement on docker; any changes made will take effect immediately.

## Dev hacks (FAQ) 🦇

**0. How can I resolve conflict on pnpm-lock.yaml?**

> CONFLICT (content): Merge conflict in pnpm-lock.yaml

When you see conflict on `pnpm-lock.yaml` and you are on your pull-request branch, merge upstream branch and run `pnpm install`, unless you have conflict on `package.json`, that requires manual resolve.

```bash
git fetch --all
git merge origin/main
pnpm install
```

**1. How can I read some data from the GraphQL?**

Every `.graphql` file is located in the `queries/`.

```graphql
query nftByIdMinimal($id: String!) {
  nft: nftEntityById(id: $id) {
    id
    currentOwner
    price
    events
  }
}
```

Then we can use it like this:

```html
<script lang="ts" setup>
const route = useRoute()
const { data: nft } = useGraphql({
  queryName: 'nftById',
  variables: { id: route.params.id },
})

console.log(nft)
</script>
```

**2. How can I read on-chain data from the RPC node?**

```html
<script lang="ts" setup>
const { apiInstance } = useApi()

const collectionId = ref('0')
const id = ref('0')
const api = await apiInstance.value
const nft = await api.query.uniques.asset(collectionId, id)

console.log(nft)
</script>
```

**3. How can I make an on-chain transaction?**

```html
<script lang="ts" setup>
async function submit() {
  const { accountId } = useAuth()
  const { howAboutToExecute, isLoading, status, initTransactionLoader } =
    useMetaTransaction()

  const executeTransaction = ({ cb, arg, successMessage, errorMessage }) => {
    initTransactionLoader()
    howAboutToExecute(
      accountId.value,
      cb,
      arg,
      () => infoMessage(successMessage || 'Success!'),
      () => dangerMessage(errorMessage || 'Failed!')
    )
  }

  executeTransaction({
    cb: api.tx.system.remark,
    arg: ['args']
  })
}
</script>
```

**4. How can I test Kodadot without spending KSM?**

For Kusama:
[You can obtain some Westend (WND)](https://matrix.to/#/#westend_faucet:matrix.org)

For Basilisk (Rococo):
[You can obtain some KSM & BSX](https://discord.com/channels/840514076538830888/881839877140930630)

You can change the network in the navbar.
Currently supported networks are `Basilisk, Kusama, Westend, statemine, westmint`.
Do you want to add more networks? [Open a PR on vuex-options](https://github.com/kodadot/packages)

## Running local Polkadot and subquery nodes

To run the complete local environment, we recommend running a [polkadot/Kusama node](https://github.com/paritytech/polkadot).
In case you are using Apple M1, we have a [tutorial for that 🍏 ](https://vikiival.medium.com/run-substrate-on-apple-m1-a2699743fae8)

Current Indexers we have/use:

- SubSquid
  - Basilisk: [snek](https://github.com/kodadot/snek)
  - Kusama: [rubick](https://github.com/kodadot/rubick)
  - Moonsama: [click](https://github.com/kodadot/click)

### MISC 🏞

#### Linting code

**Show all problems**

```bash
pnpm lint
```

**Show only errors**

```bash
pnpm lint:quiet
```

**Fix errors**

```bash
pnpm lint:fix
```

#### Generating changelog

To generate changelog, use GitHub CLI
List only merged; if you need limit, use `-L`

```bash
gh pr list -s merged --json mergedAt,baseRefName,number,title,headRefName -B main -L 37 | jq -r '.[] | .number, .title' | sed '/^[0-9]/{N; s/\n/ /;}'
```
