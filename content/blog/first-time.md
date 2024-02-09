---
date: 2023-07-01
tags: Onboarding
image: https://www.gitbook.com/cdn-cgi/image/width=1280,dpr=2,height=640,fit=contain,format=auto/https%3A%2F%2F1787703220-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-MgfLdtGYbRx63ivinWz%252Fsocialpreview%252FBa1dBZZtvOrkCu4nwMOT%252Fcover.png%3Falt%3Dmedia%26token%3D9598f81f-80aa-4e5b-bff5-b612506e6bc7
title: Your first time contributing to KodaDot
subtitle: Is this your first time contributing? Set up your local environment here.
---

We are using a `pnpm` workspace, as installing things via npm **will result in broken dependencies.**

> If you want to know how KodaDot works, go to the [DOCS](https://docs.kodadot.xyz/).

# Hyper start 🚀

## Prerequisites 🎒

```MD
node >= 20
pnpm
```

Copy and paste these commands to your terminal: (It will clone your project and install all dependencies.)

```bash
git clone https://github.com/kodadot/nft-gallery.git nft-gallery
cd nft-gallery;
pnpm i;
```

To start the server, run:

```bash
pnpm dev
```

KodaDot will be available at **[localhost:9090](http://localhost:9090).**

## Codespaces

Click on the button below:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/kodadot/nft-gallery)


Copy and paste these commands to your terminal: (It will install all dependencies and start the server.)

```
pnpm i;
pnpm dev
```

KodaDot will be available at **[localhost:9090](http://localhost:9090).**

If you’re interested in experimenting with KodaDot on the Kusama network and want a comprehensive setup with a Codespaces node, you can follow the Docker instructions provided below. Let’s get started!

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

- Getting couldn't find .env file error?

In some cases, you may get an error similar to `ERROR: Couldn't find env file: /full/path/nft-gallery/.env`; This is because docker may be looking for a `.env` file when there is none. To fix this issue, create an empty `.env` file then build the docker image again.

### From next time

- Run:

```bash
docker-compose up
```

Voila! KodaDot will be available at [localhost:9090](http://localhost:9090).
KodaDot supports Hot Module Replacement on docker; any changes made will take effect immediately.

## Submitting a pull request

To enhance your workflow with our repository, we suggest making use of the [GitHub CLI](https://cli.github.com/) to initiate a pull request. This is particularly beneficial since we offer a selection of predefined templates for your convenience.

To get started ensure that you are authenticated on the GitHub CLI and the remote repository has been set. You can find a quickstart guide [here](https://docs.github.com/en/github-cli/github-cli/quickstart).

1. To submit a new pull request use the command in your terminal:

```bash
gh pr create
```

2. You'll be prompted to select a branch. You can select your working branch or skip the step if you have already pushed your branch.

3. Next you'll be prompted for a title and to choose a template. Please use one of the predefined templates that is relevant to your pull request. You will also be given an option to edit it as required.

```bash
Creating pull request for username:example-branch into main in kodadot/nft-gallery

? Title example-branch-title
? Choose a template  [Use arrows to move, type to filter]
> PULL_REQUEST_TEMPLATE.md
  QUICK_AND_DESIGN_PULL_REQUEST_TEMPLATE.md
  QUICK_AND_QA_PULL_REQUEST_TEMPLATE.md
  QUICK_PULL_REQUEST_TEMPLATE.md
  Open a blank pull request
```

4. Once you have edited the template, submit your pull request. 🚀

Alternatively, if you cannot use GitHub CLI, you can find the templates [here](https://github.com/kodadot/nft-gallery/tree/main/.github/PULL_REQUEST_TEMPLATE) and create a pull request on github.

## Dev hacks (FAQ) 🦇

**0. How can I resolve conflict on pnpm-lock.yaml?**

> CONFLICT (content): Merge conflict in pnpm-lock.yaml

When you see conflict on `pnpm-lock.yaml` and you are on your pull-request branch, merge upstream branch and run `pnpm install`, unless you have conflict on `package.json`, that requires manual resolve.

```bash
git fetch --all
git merge origin/main
pnpm install
```

<br/>

**1. How can I read some data from the GraphQL?**

Every `.graphql` file is located in the `queries/`.

```graphql
query nftByIdMinimal($id: String!) {
  nft: nftEntityById(id: $id) {
    id
    currentOwner
    price
    events(limit: 10) {
      id
      caller
      interaction
    }
  }
}
```

Then we can use it like this:

```html
<script lang="ts" setup>
  const { $consola } = useNuxtApp()
  const route = useRoute()
  const { data: nft } = useGraphql({
    queryName: 'nftById',
    variables: { id: route.params.id },
  })

  $consola.log(nft)
</script>
```

<br/>

**2. How can I read on-chain data from the RPC node?**

```html
<script lang="ts" setup>
  const { $consola } = useNuxtApp()
  const { apiInstance } = useApi()

  const collectionId = ref('0')
  const id = ref('0')
  const api = await apiInstance.value
  const nft = await api.query.uniques.asset(collectionId, id)

  $consola.log(nft)
</script>
```

<br/>

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
        () => warningMessage(errorMessage || 'Failed!')
      )
    }

    executeTransaction({
      cb: api.tx.system.remark,
      arg: ['args'],
    })
  }
</script>
```

<br/>

**4. How can I test Kodadot without spending KSM?**

For Basilisk (Rococo):
[You can obtain some KSM & BSX](https://discord.com/channels/840514076538830888/881839877140930630)

You can change the network in the navbar.
Currently supported networks are `Basilisk`, `Basilisk-Rococo` and `Kusama`.
EVM chains such as `MoonBeam` and `MoonRiver` are in read-only mode.

## Running local Polkadot and subquery nodes

To run the complete local environment, we recommend running a [polkadot/Kusama node](https://github.com/paritytech/polkadot).
In case you are using Apple M1, we have a [tutorial for that 🍏 ](https://vikiival.medium.com/run-substrate-on-apple-m1-a2699743fae8)

Current Indexers we have/use:

- SubSquid
  - Basilisk: [snek](https://github.com/kodadot/snek)
  - Kusama: [rubick](https://github.com/kodadot/rubick)
  - AssetHub: [stick](https://github.com/kodadot/stick)
  - MoonRiver: [click](https://github.com/kodadot/click)

<br/>

## MISC 🏞

### Linting code

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

<br/>

### Generating changelog

To generate changelog, use GitHub CLI
List only merged; if you need limit, use `-L`

```bash
gh pr list -s merged --json mergedAt,baseRefName,number,title,headRefName -B main -L 37 | jq -r '.[] | .number, .title' | sed '/^[0-9]/{N; s/\n/ /;}'
```
