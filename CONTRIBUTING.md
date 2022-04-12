# Contributing to KodaDot: NFT gallery

KodaDot NFT gallery has a plan to be builders-owned.
We are welcoming community contributions from you.
Take a sneak peek on [good first issues](https://github.com/kodadot/nft-gallery/contribute), comment, and make PR.
If everything goes well, chances that you will be **rewarded are high**.
We might give retro-active bounties where the bounty label wasn't present if we like your contribution.

**For better coordination, please join our [Development channel (#coordination) on Discord](https://discord.gg/4CeHXamhqB)**

## Getting started

Before you being:

- We utilize [**Node.js**](https://nodejs.org) as a development tool. To avoid potential compatibility issues, check if you're on the version of **Node.js we support.**
- Make sure that you use [**pnpm**](https://pnpm.io/installation) as the package manager.
- Please have a read the [code of conduct](CODE_OF_CONDUCT.md)
- [Learn how to set up your environment for the first time](FIRST_TIME.md)

### Which issue should you pick?

We are working primarily on two metrics. Issues have priorities by labels [p1-p5](https://github.com/kodadot/nft-gallery/labels), **p1 means urgent**, **p5 in research mode**. Then we have bounties for issues in the range of **$ - $$$$$**.

If you are going to contribute, please select issues with the highest urgency (p1, p2) first. It makes a huge difference for users to fix high-priority issues. If there is no such issue, our **best advice is to choose issues reflecting your skillset and experience**.

### Open a pull request

When you update the code, and you'd like to propose them for review, use the pull request template to open your PR (Pull Request) against our `main` branch.

### Submit your PR & Get it reviewed

- Once you submit your PR, others from the developers community will review it with you. The first thing you'll want to do is a [self-review](#self-review).
- After that, we may have questions; check back on your PR to keep up with the conversation.
- Did you have an issue, like a merge conflict? Check out our [git tutorial](https://lab.github.com/githubtraining/managing-merge-conflicts) on **how to resolve merge conflicts and other issues.**

### Your PR is merged!

Congratulations! The whole Metaprime & KodaDot community thanks you. ✨

## Rewards

To scale our development and operations, we prefer paid trials to know developers better and fit the team. More your PRs gets merged to `main` branch, **more-likely you'll be part of the inner team.**
On-demand or part-time contributions are welcome, and **we will reward them in $KSM**

KodaDot has started on [Kusama.network](https://kusama.network), and we prefer to pay out for your work in $KSM, which is the native cryptocurrency of Kusama network, [Polkadot's Canary network](https://polkadot.network) with bearing value.

### Creating your KSM address

To create your KSM address in safely and long-term manner, we recommend you to get [Polkadot.js wallet browser extension](https://guide.kusama.network/docs/learn-account-generation/#polkadotjs-browser-plugin). You can [learn more about creating KSM address process at the official Kusama Guide](https://guide.kusama.network/docs/learn-account-generation/)

### Sharing your address to receive the reward

After creating an account, you can visit [KodaDot Transfer](https://kodadot.xyz/transfer) to make a payment link. Entering an amount like 100 USD and clicking the button **COPY REWARD ME LINK** will copy the link to your clipboard, and you can share it with us, like whenever you are filling up a bug report or submitting pull-request

your receiving address should be looks like this

`https://kodadot.xyz/transfer?target=${your address}&usdamount=100&donation=true`

### Switching account/network

While you are on your _[accounts](https://polkadot.js.org/apps/#/accounts)_ dashboard, check the top-left corner to confirm and ensure your current network. Click the avatar to see options to select from and switch as desired.

> To switch to Kusuma Network, search and select **KUSAMA** under _KUSAMA & PARACHAINS_ and `switch` by selecting the **switch** option at the top-most area of the opened side nav.

### Checking your KSM balance

Check `balances` under your _[accounts](https://polkadot.js.org/apps/#/accounts)_ dashboard to see that. Because we use KSM, you need to ensure you are on the _Kusuma network_. Check the top-left corner to confirm and ensure your `balance` is in **KSM**. If not, kindly _switch network_ by clicking the avatar on your top-left corner, and switch to **_Kusuma_**. Your **balances** will now be in **KSM**.

### Bounty levels

Our typical payout structure for bounties is per label on the issue. Here is the table for an overview

|                              $                               |                          $$                           |                                $$$                                |                              $$$$                               |                                         $$$$$                                          |
| :----------------------------------------------------------: | :---------------------------------------------------: | :---------------------------------------------------------------: | :-------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
|                            50-100                            |                        150-300                        |                              450-600                              |                           700 - 1000                            |                                         1000+                                          |
| Beginner, few lines, <br /> lot of comments/assistance on PR | Required brain use, <br /> smart solution, autonomous | Complex, delivered new shiny stuff, <br /> did not break anything | Dedicated, new feature, rework older stuff, quick delivery time | You seems reliable, responsible, we can trust you, and you have alignment with project |

You can [check recent labels](https://github.com/kodadot/nft-gallery/labels)

## Hiring process

Continue to [HIRING.md]()

# Learn more about contributing:

## Types of contributions 📝

You can contribute to the GitHub KodaDot & Metaprime content and site in several ways. This repo is a place to discuss and collaborate on [kodadot.xyz](https://kodadot.xyz)!

Our small but mighty 💪 developer community is maintaining this repo. To preserve our bandwidth, off-topic conversations will be closed.

## Dynamics of Contributing

### Assign Issues

Whenever someone comments on an issue that they want to fix, they have approximately 48 hours to open PR with a working solution. Whenever they fail to do so, you can take it as we might have a few dead issues in the repository. Until we have a bot that can assign issues, this is the way. Until the issue is explicitly stated as a competition issue, we want to avoid double work as we have many issues in our repository.

### Pull Requests

Whenever you open PR against our repository, our best recommendation is to finish it quickly, i.e., **being merged under 72h since opening/last discussion**, if it's not a complex issue requiring more profound attention of more members. Otherwise, you will be raising the chance to face many merge conflicts.

### Avoiding stalled PRs

When the issue is **converted to a draft, and you don't reply within 48h**, we will close it and unassign you from the task to leave room for someone else to finish the PR who has more availability and codebase understanding.

### Issues 🐞

Issues are used to track tasks that contributors can help with. If an issue has a triage label, we haven't reviewed it yet, and you shouldn't begin work on it.

If you've found something in the content or the website that should be updated, search open issues to see if someone else has reported the same thing. If it's something new, open an issue using a template. We'll use the issue to talk about the problem you want to fix.

### Pull requests 🛠️

A pull request is a way to suggest changes in our repository.

When we merge those changes, they should be deployed to the live site within 24 hours. 🌍 To learn more about opening a pull request in this repo, see Opening a pull request below.

### Code reviews 🕵️‍♀️

As on daily basis is no wonder we can get 10-20 pull-requests on daily basis, code reviews are current bottleneck. To help us, you should have enough contributed and merged PRs into main branch, familiarity with code base and prefer high quality code. If you want to be member let us know in coordination channel best to be part of [Code Review Guild of KodaDot](https://github.com/orgs/kodadot/teams/code-review-guild)

### Support ❓

We are a small team working hard to keep up with the documentation demands of a continuously changing product. Unfortunately, we can't help with support questions in this repository. If you are experiencing a problem with GitHub unrelated to our documentation, please get in touch with GitHub Support directly. Any issues, discussions, or pull requests opened here requesting support will be given information about contacting GitHub Support, then closed and locked.

If you're having trouble with your GitHub account, contact [support](https://support.github.com).

## Issues

Issues are precious to this project.

- Ideas are a valuable source of contributions others can make
- Problems show where this project is lacking
- With a question, you show where contributors can improve the user experience

Thank you for creating them.

### Labels

Labels can help you find a perfect issue for your skills.

The [help wanted](https://github.com/kodadot/nft-gallery/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) label is for problems or updates that anyone in the community can start working on.
The [good first issue](https://github.com/kodadot/nft-gallery/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) label is for problems or updates we think are ideal for beginners.

## Pull Requests

Pull requests are a great way to get your ideas into this repository.

When deciding if we merge in a pull request, we look at the following things:

### Does it state intent

You should be clear about which problem you're trying to solve with your contribution.

For example:

> Add a link to code of conduct in README.md

Doesn't tell me anything about why you're doing that

> Add a link to code of conduct in README.md because users don't always look in the CONTRIBUTING.md

**Tell me the problem you have found, and the pull request shows me the action you have taken to solve it.**

### Is it of good quality

- There are no spelling mistakes
- It reads well
- For English language contributions: Has a good score on [Grammarly](https://grammarly.com) or [Hemingway App](http://www.hemingwayapp.com/)
- Haven't used force-push. If that is the case, PR will be closed.

### Reviewing

We (usually the core team, sometimes KodaDot engineers or support too!) review every PR. The purpose of reviews is to create the best content for people who use KodaDot.

💛 Reviews are always respectful, acknowledging that everyone did the best possible job with the knowledge they had at the time.

💛 Reviews discuss content, not the person who created it.

💛 Reviews are constructive and start a conversation around feedback.

### Self-review

You should always review your PR first.

For content changes, make sure that you:

- Confirm that the changes address every part of the content design plan from your issue (if there are differences, explain them).
- Review the content for technical accuracy.
- Review the entire pull request using the localization checklist.
- Copy-edit the changes for grammar, spelling, and adherence to the style guide.
- Check new or updated Liquid statements to confirm that versioning is correct.
- Check that all of your changes render correctly in staging. Remember that lists and tables can be tricky.
- If there are any failing checks in your PR, troubleshoot them until they're all passing.

### Update strategy: always use `merge`

Try to submit your PR as soon as possible. That's always an excellent way to avoid conflict with other commits.

However, if the conflict happens, we want you always use `merge` to resolve it. The reason is
we don't want to mix the merging strategies, and we want to see only your commits in your PR.

### Pull request template

When you open a pull request, you must fill out the "Ready for review" template before we can review your PR. This template helps reviewers understand your changes and the purpose of your pull request.

# Troubleshooting

### Code quality

We follow what we have in `.eslintrc.js`, and you can see warnings and errors by running `pnpm lint`. With `pnpm lint --fix`, you will get auto fixed code.

### Don't have access to push to the repository

You need to fork the repository, commit a change to your repository, and [create pull request](https://opensource.com/article/19/7/create-pull-request-github).

### Does it move this repository closer to my vision for the repository

The aim of this repository is:

- To provide a [README](README.md) and assorted documents anyone can copy and paste into their project
- The content is usable by someone who hasn't written something like this before
- Foster a culture of respect and gratitude in the open-source community.

### Better comfort

For crafting much better culture and Developer Experience, we reccomend some extension to browse issues faster

- [Refined Github](https://chrome.google.com/webstore/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf)
- [Github HoverCard](https://chrome.google.com/webstore/detail/github-hovercard/mmoahbbnojgkclgceahhakhnccimnplk)
- [Gifs for Github](https://chrome.google.com/webstore/detail/gifs-for-github/dkgjnpbipbdaoaadbdhpiokaemhlphep)
- Feel free add your extension which helps you organize and being productive on Github

### Does it follow the contributor covenant

This repository has a [code of conduct](CODE_OF_CONDUCT.md). This repository has a code of conduct, and I will remove things that do not respect it.

### Related

Check best [contributing.md](https://github.com/github/docs/blob/main/CONTRIBUTING.md)
