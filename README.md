# 📱 Apps
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Apps are core components of [KodaDot wallet](https://twitter.com/KodaDot).

Basic usage is to interact from browser with Polkadot and Substrate based networks.

## 🐦 [Follow us on Twitter @KodaDot](https://twitter.com/KodaDot)

## ▶️ Demo versions
* 👩‍✈️[Stable release - could be used for production](https://kodadot.netlify.app/)
* [🚧👷‍♀️ Development preview release - may not work everytime](https://dev-kodadot.netlify.app/)

## 🕹 Play

```shell
git clone git@github.com:kodadot/nft-gallery.git
cd dashboard;yarn
yarn serve
open http://localhost:8080/
```

## 🏦 Stage One
* [Accounts](https://kodadot.netlify.app/#/accounts) - It offers basic management functionality to work with Accounts
* [Address book](https://kodadot.netlify.app/#/addressbook) - It offers basic management functionality to work with Addresses
* [Democracy](https://kodadot.netlify.app/#/democracy) - It offers basic voting app, allowing votes on activate proposals and referenda.
* [Extrinsics](https://kodadot.netlify.app/#/extrinsics) - Extrinsics page is enviroment where user is able to execute every available transaction on the selected node.
* [Transfer](https://kodadot.netlify.app/#/transfer) - Transfer function is abstraction on top of extrinsics for transfering various assets of network.
* [Settings](https://kodadot.netlify.app/#/settings) - It provide seamless integration of vue-settings and vue-api inside Vuex, allowing choice of language, node to connect to, and theme.

## 🏯 Stage Two
* [Explorer](https://kodadot.netlify.app/#/explorer) - Explore chain name, best block, finalized blocks, total isuance, number of validators, state of epoch & era, deep dive in too finalized blocks, see hash of parent block, extrinsics and state. Next to it explore events happening in extrinsics, i.e. treasury deposit, balance transfers, council votes, democracy events and various governance drive
* [ChainState - Storage](https://kodadot.netlify.app/#/chainstate) - Find out what's in Storage of chain, what are constants and raw inputs. Simple node query application, multiple queries can be queued and updates as new values become available
* [ToolBox](https://kodadot.netlify.app/#/toolbox) - Utility hashing functions like Sign, Verify with accounts and hash data. 
* [RPC](https://kodadot.netlify.app/#/rpc) - Submission of raw data to RPC endpoints
* [Treasury](https://kodadot.netlify.app/#/treasury) - Vote on proposals and send tips 
* 🏗 [Staking](https://kodadot.netlify.app/#/staking) - Staking managment, you can stake and nominate

## 🏗 Development

Contribution is welcome!

We are using `yarn` workspace, as installing things via npm **will result in broken dependencies.**

### 👷‍♀️ Get Started

1. Clone the repo `git clone git@github.com:kodadot/nft-gallery.git <optional local path>`
2. Ensure that you have a recent LTS version of [Node.js](https://nodejs.org/en/), we are using in time of writing version `v12.16.0`
3. Recent version of [Yarn](https://yarnpkg.com/docs/install), we are now using `1.22.4`
4. Install the dependencies by running `yarn`
5. Now you can launch the UI. You can have local running [Substrate node](https://substrate.dev/docs/en/tutorials/start-a-private-network-with-substrate) or connect to existing networks
6. Access the UI at [http://localhost:8080/](http://localhost:8080/)

## 🙋‍♀️ I want to contribute

Sure, your contribution is welcome. Please follow [code of conduct](CODE_OF_CONDUCT.md) and [contribution guidelines](CONTRIBUTING.md)


## 🐳 Docker
If you want just to try out our KodaDot on Kusama and have full local setup with local node, we assume you have [docker](https://docs.docker.com/get-docker/) and docker-compose installed. We have are building [images from develop and master branch](https://hub.docker.com/r/yangwao/kodadot/tags?page=1&ordering=last_updated)

You need to make yourself be in `/dashboard` directory first
```
docker-compose pull && docker-compose up
```

If you want to run just KodaDot
```
docker-compose up kodadot
```

Build docker image of KodaDot
```
docker build -t hello/kodadot .
```

Run it locally and then visit `localhost:8080`
```
docker run -it -p 8080:8080 --rm --name hellokodadot hello/kodadot
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/vikiival"><img src="https://avatars.githubusercontent.com/u/22471030?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Viki Val</b></sub></a><br /><a href="#design-vikiival" title="Design">🎨</a> <a href="https://github.com/kodadot/nft-gallery/commits?author=vikiival" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!