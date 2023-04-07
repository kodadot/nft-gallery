# Contributing to KodaDot: NFT gallery

KodaDot NFT gallery **has a plan to be builders-owned and become ultimate public good**

We are welcoming community contributions from you by rewarding your contributions.
Take a sneak peek on [good first issues](https://github.com/kodadot/nft-gallery/contribute), comment, and make PR.
If everything goes well, chances that you will be **rewarded are high**.

We might give retro-active reward, where the bounty label wasn't present, **if we like your contribution.**

**For better coordination, please join our [Development channel (#coordination) on Discord](https://discord.gg/4CeHXamhqB)**

## Getting started

Before you being:

- We utilize [**Node.js**](https://nodejs.org) as a development tool. To avoid potential compatibility issues, check if you're on the version of **Node.js we support.**
- Make sure that you use [**pnpm**](https://pnpm.io/installation) as the package manager.
- Please have a read the [code of conduct](CODE_OF_CONDUCT.md)
- [Learn how to set up your environment for the first time](FIRST_TIME.md)
- Get familiar with our [coding conventions & recommendations](STYLE_GUIDE.md)
- Read up on our [tech stack](https://medium.com/kodadot/the-tech-stack-at-kodadot-8a83880f8624) to get a better picture of the infrastructure we rely on
- Familiarise yourself with our [contributor culture](https://medium.com/kodadot/contributor-culture-at-kodadot-665243d3d6a6) to better understand the dynamics by which we operate

Recommended VSCode Extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)
- [Monorepo Workspace](https://marketplace.visualstudio.com/items?itemName=folke.vscode-monorepo-workspace)

### Which issue should you pick?

We are working primarily on two metrics.
Issues have

- priorities by labels [p1-p5](https://github.com/kodadot/nft-gallery/labels), **p1 means urgent**, **p5 in research mode**.
- bounty labels for issues in the range of **$ - $$$$$**. Check [Rewards](REWARDS.md)

If you are going to contribute, please select issues with the highest urgency (p1, p2) first. It makes a **significant difference for users to fix high-priority issues**.
If there is no such issue, our **best advice is to choose issues reflecting your skillset and experience**.

### Assigning Issues

- **Each developer has a limit of 5 issues assigned to him at any time**.
- Each bounty label has allocated time for assignment in the increment of 24 hours `$: 24h, $$: 48h, $$$: 72h, $$$$: 96h, $$$$$: 120h`. Frequent contributors (10+ merged PRs) get a bonus of 50% of the allocated time.
- Whenever you find an issue that you want to fix, you can get it assigned by commenting on the issue with the emote `:wave:` -> :wave: which will trigger KodaBot to assign this issue to you
- If there is an ongoing assignment, the bot can get into the `queue` for the issue with the emote `:wave:` -> :wave:, and in case the assignee won't finish in time, you will have an `option period` of 12 hours to pick the issue up with the emote `:wave:` -> :wave:.
- In case you want to drop out of the assignment, you can manually unassign yourself
- If you'd like to get out of the `queue` or pass during your `option period` to pick an issue, commenting `pass` will make you drop out
- Once your assignment runs out, KodaBot will unassign you and leave a chance open for other participants
- Opening PR in time will ensure that you won't get unassigned, and that issue stays yours until the PR gets resolved
- Getting unassigned, dropping out of the queue, or passing on the option to pick the issue forbids you from further participation in this particular issue.
- **ignoring issue**: sometimes, you might work on an issue that doesn't need supervision / assigning from a bot or help from the team. As an example, consider a small issue, quick fix, something without a bounty label, etc. In this case, you can comment `ignore` to the issue to prevent KodaBot from reacting to this issue. This feature is available only to collaborators on nft-gallery.

### Opening Pull Requests

Whenever you open PR against our repository, our best recommendation is to finish it quickly, i.e., **being merged under 72h since opening/last discussion**, if it's not a complex issue requiring more profound attention of more members. Otherwise, you will be raising the chance to face many merge conflicts.

### Submit your PR & Get it reviewed

- Once you submit your PR, others from the developers community will review it with you. The first thing you'll want to do is a [self-review](#self-review).
- After that, we may have questions; check back on your PR to keep up with the conversation.
- Did you have an issue, like a merge conflict? Check out our [git tutorial](https://lab.github.com/githubtraining/managing-merge-conflicts) on **how to resolve merge conflicts and other issues.**

### Your PR is merged!

Congratulations! The whole Metaprime & KodaDot community thanks you. ✨

### Avoiding stalled PRs

When the issue is **converted to a draft, and you don't reply within 48h**, we will close it and unassign you from the task to leave room for someone else to finish the PR who has more availability and codebase understanding.

## Rewards

Continue to [REWARDS.md](REWARDS.md)

## Hiring process

Continue to [HIRING.md](HIRING.md)

# Types of contributions 📝

You can contribute to the GitHub KodaDot & Metaprime content and site in several ways. This repo is a place to discuss and collaborate on [kodadot.xyz](https://kodadot.xyz)!

Our small but mighty 💪 developer community is maintaining this repo. To preserve our bandwidth, off-topic conversations will be closed.

## Issues 🐞

Issues are used to track tasks that contributors can help with. If an issue has a triage label, we haven't reviewed it yet, and you shouldn't begin work on it.

Issues are precious to this project.

- Ideas are a valuable source of contributions others can make
- Problems show where this project is lacking
- With a question, you show where contributors can improve the user experience

Thank you for creating them.

If you've found something in the content or the website that should be updated, search open issues to see if someone else has reported the same thing. If it's something new, open an issue using a template. We'll use the issue to talk about the problem you want to fix.

### Labels

Labels can help you find a perfect issue for your skills.

- The [help wanted](https://github.com/kodadot/nft-gallery/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) label is for problems or updates that anyone in the community can start working on.
- The [good first issue](https://github.com/kodadot/nft-gallery/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) label is for problems or updates we think are ideal for beginners.

## Pull requests 🛠️

A pull request is a way to suggest changes in our repository.
When we merge those changes, they should be deployed to the live site within 24 hours.

### Pull request template

When you open a pull request, you must fill out the "Ready for review" template before we can review your PR. This template helps reviewers understand your changes and the purpose of your pull request.
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

### Code reviews 🕵️‍♀️

As on daily basis is no wonder we can get 10-20 pull-requests on daily basis, code reviews are current bottleneck. To help us, you should have enough contributed and merged PRs into main branch, familiarity with code base and prefer high quality code. If you want to be member let us know in coordination channel best to be part of [Code Review Guild of KodaDot](https://github.com/orgs/kodadot/teams/code-review-guild)

### Support ❓

We are a small team working hard to keep up with the documentation demands of a continuously changing product. Unfortunately, we can't help with support questions in this repository. If you are experiencing a problem with GitHub unrelated to our documentation, please get in touch with GitHub Support directly. Any issues, discussions, or pull requests opened here requesting support will be given information about contacting GitHub Support, then closed and locked.

If you're having trouble with your GitHub account, contact [support](https://support.github.com).

### Reviewing

We (usually the core team, sometimes KodaDot engineers or support too!) review PR where they have been requested to do so.

The purpose of reviews is to create the best content for people who use KodaDot and raise code-quality at each pull-request.

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

### Keeping tests relevant🔬

Since we're using [Cypress](https://www.cypress.io/) as our primary E2E tool for testing, we need to ensure that newly added features are not breaking tests we previously implemented. Tests run automatically as [GitHub action](https://github.com/features/actions) to catch bugs introduced by development. Still, it's essential to check whether the failing test broke something or whether the subject of the test changed.

One of the main reasons tests will fail (except when bugs get introduced) is that we're using custom HTML tags to [select elements](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements) within the testing suite. If your contribution touches components with these custom tags and you get failed tests, these selectors must be checked and usually adjusted.

You can identify these kinds of problems by seeing similar-looking test reports:
`Expected to find element: [data-cy="submit"], but never found it.`

TL;DR: If you're touching components which include HTML tags such as `data-cy="submit"`, and the tests fail, make sure the tests still use the correct selector.

**Example:**

```html
<button
  id="main"
  class="btn btn-large"
  name="submission"
  role="button"
  data-cy="submit">
  Submit
</button>
```

### Update strategy: always use `merge`

Try to submit your PR as soon as possible. That's always an excellent way to avoid conflict with other commits.

However, if the conflict happens, we want you always use `merge` to resolve it. The reason is
we don't want to mix the merging strategies, and we want to see only your commits in your PR.

# Troubleshooting

### Code quality

- We follow what we have in `.eslintrc.js`, and you can see warnings and errors by running `pnpm lint`. With `pnpm lint --fix`, you will get auto fixed code.
- We've formed [STYLE_GUIDE.md](STYLE_GUIDE.md) to help you answer formatting questions.

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

## Follow us

- [Twitter @KodaDot](https://twitter.com/kodadot)
- [Medium Kodadot](https://medium.com/kodadot)
- [Documentation](https://docs.kodadot.xyz)

### Related

Check best [contributing.md](https://github.com/github/docs/blob/main/CONTRIBUTING.md)
