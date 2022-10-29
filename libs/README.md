# shared packages for nft-gallery

## @kodadot1/brick

Reusable components based on neobrutalism style. This package is using [histoire](https://histoire.dev/) to manage the components. Some keys how to manage our component with histoire:

- [Stories](https://histoire.dev/guide/vue2/stories.html)
- [State & Controls](https://histoire.dev/guide/vue2/controls.html)
- [Events](https://histoire.dev/guide/vue2/events.html)

Development:

```sh
# run this command from root folder
pnpm -F brick story:dev

# or, run this command from libs/ui folder
pnpm story:dev
```

Export Component:

```ts
// make sure to export the component in index.ts
export { default as TheComponent } from './components/TheComponent/TheComponent.vue'
```

Usage

```ts
import { TheComponent } from '@kodadot1/brick'
```
