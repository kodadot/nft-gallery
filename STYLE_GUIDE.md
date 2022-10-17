# KodaDot Style Guide v1.0

As codebases grow in size and complexity, it is necessary to establish and maintain some kind of **style guide to which each contributor should conform**. While tools like ESLint and Prettier can support us in this regard, additional rules are needed to allow us to better communicate with each other. Since our community is coming from all around the world, working together asynchronously, **clear communication** is of utmost importance.

The following set of conventions should make it easier for you to understand our code and aid you in making meaningful contributions to the project:

## Naming Conventions
Give your functions, components and files **speaking/self-explanatory names** (e.g. `getCollectionById()`, `KeyboardShortcuts.vue`, `setIdentity.ts`).
With a few exceptions, code and comments should be written in **English** only.

### Nuxt/Vue-specific Files
- **Pages** and **layouts** use **kebab-case** (`series-insight.vue`)
- **All other components** (in folder `/components`) use **PascalCase** (`CookieBanner.vue`)

### Others
- **Folders** are written in **lowercase** (`components/spotlight`)
- **Typescript**, **Javascript** and **GraphQL** files use **camelCase** (`globalVariables.ts`, `getKey.js`, `collectionById.graphql`)
- **SCSS** files use **kebab-case** (`initial-variables.scss`)
- **JSON** files use **snake_case** (`all_lang.json`) while **Markdown** files use **SCREAMING_SNAKE_CASE** (`CONTRIBUTING.md`)

## SFC Conventions
### Skeleton
99% of the time your SCSS should be **scoped**, which makes sure your CSS won't bleed outside of your component and pollute the global namespace!
```vue
<template>
    <div>
        ...
    </div>
</template>

<script setup>
  ...
</script>

<style scoped lang="scss"></style>
```

### Composition API
Since we want to upgrade to Nuxt 3 in the near future, we should pre-emptively work towards a compatible codebase, such that the transition will be as smooth as possible. Therefore, every new feature is required to be written in the new **Composition API** and should follow the following recommendations: 

```vue
<script setup>
import { computed, reactive, ref, onMounted, watch } from 'vue'
import type { CarouselNFT } from '@/components/base/types'

// declaring props
const props = defineProps<{
  nfts: CarouselNFT[]
}>()

// reactive state
const count = ref(0)

// functions that mutate state and trigger updates
function increment() {
  count.value++
}


const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// a computed ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})

watch(count, (newCount) => {
  console.log(`count is ${newCount}`)
})

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>

```
For more details make sure to checkout [Vue's official documentation](https://vuejs.org/guide/introduction.html).


### Property Decorators DEPRECATED! (only use this syntax for maintenance reasons)
We rely on the package 'nuxt-property-decorator', hence, we urge you to comply with the [Nuxt Class Component Syntax](https://github.com/nuxt-community/nuxt-property-decorator/)
```typescript
import {
  Component,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Watch,
} from "nuxt-property-decorator"

@Component({})
export class MyComponent extends Vue {
  @Inject() foo!: string

  @Model("change") checked!: boolean

  @Prop() propA!: number

  @Provide() foo = "foo"

  @Watch("child")
  onChildChanged(val: string, oldVal: string) {}
}
```

### Using Components In Templates
Custom components and prop bindings should be used like this
```vue
<MyCustomComponent :propertyName="doSomething">
    {{ someProperty }}
</MyCustomComponent>
```

Use shorthands for vue attributes
- `:href` instead of `v-bind:href`
- `@click` instead of `v-on:click`
- ...

### Fetching Data
Though we haven't yet transitioned most of our data fetching logic to Nuxt lifecycles, the following syntax should be considered best practice:
#### Composition API
```typescript
// useGraphql is a composable function that is auto-imported without having to use an explicit import statement
// you can then call a specific GraphQL query like this in any of your SFCs
const { data } = useGraphql({
  queryName: 'buyEventByProfile',
  variables: {
    id: address,
  },
})
```
For reference you can take a look at `useCarousel.ts` and its usage throughout the app. It will show you how to best abstract such calls into its own [composables](https://vuejs.org/guide/reusability/composables.html), which is one of the core concepts behind the Composition API.


#### Class API (DEPRECATED)
```typescript
// pages
import { Component } from 'nuxt-property-decorator'

@Component({
  async asyncData({ app, $config, params }) {
    const res = await app?.apolloProvider?.clients[$config.prefix].query({
      query: queryGql,
      variables: {
        id: params.id
      },
    })

    return {
      data: res.data,
      total: res.total,
    }
  }
})
export default class ClassName extends Vue {
  data?: Type
  total?: Type

  [...]
}
```

### Reusability Through Abstraction
If your component will be used on several occasions in many different contexts, you should think about how you pass data to your components and how events are handled.
Regarding event handling, you should always aim to emit events happening in your component, while the handling should be done in the parent or page itself. Thereby, the click of a button can trigger all kinds of functionality without being aware of its context.
```vue
<template>
    <!-- ParentComponent.vue -->
    <ChildComponent @remove="removeItemFromList" />
</template>
```
```vue
<template>
    <!-- ChildComponent.vue -->
    <div @click="$emit('remove')" />
</template>
```

Make reusable components as generic as possible. Therefore, the naming should only imply the functionality of the component itself and not what it does in the given context.
```vue
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ListItem } from '@/components/ListItem.vue'

interface IListItem {
    name: string,
    text?: string,
}

@Component({
    components: {
        ListItem
    },
})
export default class List extends Vue {
    @Prop({ type: Array, default: () => [] }) items!: IListItem[]

    get getItemsWithText(): IListItem[] {
        return this.items.filter(item => item.text) || []
    }
}
</script>
```

## Vuex Conventions
- each module is defined in its own file -> Explorer Module has its state, actions, mutations, getters defined in `explorer.ts`
- **mutations** should only be **triggered via actions** and should be named in **SCREAMING_SNAKE_CASE**:
```typescript
// action
setLayoutClass({ commit }: { commit: Commit }, data) {
    commit('SET_LAYOUT_CLASS', data)
},
// mutation
SET_LAYOUT_CLASS(state: PreferencesState, data) {
    state.layoutClass = data
}
```
- **state properties** should always be **accessed via getters**:
```typescript
get classLayout() {
    return this.$store.getters['preferences/getLayoutClass']
}
```

## General Conventions

### brace-style

Even if the statement of a block is just one line, stick to a more elaborate
syntax and consistent way to do brace-style

❗ bad
```js
if (something) return 1

if (something) return 1
else return 2

function foo()
{
  return true;
}
```

✅ good
```js
if (something) {
  return 1
}

if (something) {
  return 1
} else {
  return 2
}

function foo() {
  return true
}
```

### for loops

Try to use more functional approaches since loop is really hard to maintain.
Beside if you really need using `for` loop, you should using `for-of` loop
since by doing so we can avoid off-by-one errors

❗ bad
```js
for (let x = 0; x < 10; x++) {
  const element = list[x]
  // your statement
}
```

✅ good
```js
// Best
list.forEach(element => ...)

// Good
for (const element of array) {
  // your statement
}
```
