<<<<<<< HEAD
# 🖼👀 NFT Market/Gallery on Kusama & Polkadot
=======
# 📱 Apps
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
>>>>>>> ef77d3dac6abf05581c24c40403f23bdc8c8d54c


## Social medias
* [telegram.me/kodadot](https://t.me/kodadot)
* [twitter.com/@KodaDot](https://twitter.com/KodaDot).
* [r/KodaDot](https://www.reddit.com/r/KodaDot/)

## Readings 
* [The First Multilingual NFT Gallery in Polkadot ecosystem running live on Kusama](https://medium.com/kodadot/the-first-multilingual-nft-gallery-in-polkadot-ecosystem-running-live-on-kusama-b8f7566770be)
* [Read our story, how we started.](https://medium.com/kodadot/kodadot-nft-explorer-f2c3a326a856)
* [Traverse to the prime show](https://medium.com/kodadot/traverse-to-the-prime-show-733d6046d3f5)

## ▶️ Demo version

* 👩‍✈️[Stable release](https://nft.kodadot.xyz/)

## 🏗 Development

[Contribution is welcome!](CONTRIBUTING.md)

We are using `yarn` workspace, as installing things via npm **will result in broken dependencies.**

## Contributors 

<a href="https://github.com/kodadot/nft-gallery/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kodadot/nft-gallery" />
</a>

Made with [contributors-img](https://contrib.rocks).

## 🕹 Play

```shell
git clone git@github.com:kodadot/nft-gallery.git
cd dashboard;yarn
yarn serve
open http://localhost:9090/
```

## 🙋‍♀️ I want to contribute

Sure, your contribution is welcome. Please follow [code of conduct](CODE_OF_CONDUCT.md) and [contribution guidelines](CONTRIBUTING.md)

## Support the project ⭐
If you feel awesome and want to support us in a small way, please consider starring and sharing the repo! This helps us getting known and grow the community. 🙏


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

Run it locally and then visit `localhost:9090`
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