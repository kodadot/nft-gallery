---
date: 2024-02-15
tags: Polkadot Asset Hub Statemint
image: '/blog/a-brief-tour-of-kusama-asset-hub.webp'
title: 'A brief tour of Polkadot Asset Hub'
subtitle: 'The chain that puts the community first.'
---

## What is the Polkadot Asset Hub?

 Polkadot Asset Hub (formerly Statemint) is a parachain on Polkadot for creating and sending fungible and non-fungible tokens, with the native token being DOT. Its Kusama equivalent is the similarly named Kusama Asset Hub (formerly Statemine). It connects directly to the Relay Chain, enabling easy exchange of information and assets between parachains. This sounds nice and all, but how is it any different from other chains on the Polkadot network?

## Why Asset Hub?

Asset Hub is a "common good" parachain, meaning it exists primarily for the benefit of the community in various ways.
- The chain does not use smart contracts. Instead, all the execution details and expenses of an operation on an asset are encoded on the chain already. This is cheaper and more predictable in terms of fees compared to smart contracts. The fee  is determined through prior benchmarks of similar processes.
- By being the most convenient option to deploy assets, the chain provides a large community for a busy marketplace to explore or buy from.
- It is more efficient than the Relay chain for DOT balance transfers.
- Low existential deposit required (minimum amount an account must have to exist on chain) compared to other chains.

## Assets
The process of creating an asset on Polkadot Asset Hub is well documented [here](https://wiki.polkadot.network/docs/learn-guides-assets-create) in case you need the latest data or a more detailed reference. I will not go into too much detail.

Any account on the Asset Hub needs to have at least a certain amount in its balance called existential deposit (currently 0.1 DOT), failure to which the account is deleted from the network. This leaves room for only accounts that add value, reducing congestion on the network.

There are two types of assets, sufficient and non-sufficient.
A sufficient asset means that the asset's balance (determined by the creator) is enough to create an account on the Asset Hub without needing an existential deposit. This is possible only when approved by the relay chain governance.
A non-sufficient asset needs to be tied to an existing account (one that meets the existential deposit). Sufficiency is visible as a property on an asset and it cannot be changed by the person creating the asset.

Assets have several properties. The creator specifies a unique `AssetId` to identify the asset to be created. The asset can optionally contain metadata such as description, date created, etc. To secure our created assets, we need to establish who controls the various permissions of the created asset. These permissions (privileges) can be set by the creator on different accounts or the same account as desired. For example, wallet address 3847238yheu can only mint tokens, wallet address 894y5eruffw can only burn tokens and wallet 309483728ewf can do any operation on the asset (admin). A full list of available privileges can be found [here](https://crates.parity.io/pallet_assets/index.html#overview) for fungible assets and [here](https://wiki.polkadot.network/docs/learn-nft-pallets#roles) for non-fungible assets.

# Conclusion
Polkadot Asset Hub is just another parachain on Polkadot but more convenient for creating and storing assets. It is now easier than ever to create digital value on Polkadot without much thought about what chain you will use or possible outrageous gas fees.

# Further reading
[This article](https://www.parity.io/blog/statemint-generic-assets-chain-proposing-a-common-good-parachain-to-polkadot-governance/) on the motivations and vision of a common good parachain.

[Kusama Asset Hub docs](https://wiki.polkadot.network/docs/learn-assets).

