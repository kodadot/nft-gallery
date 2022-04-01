# KodaDot Style Guide v1.0

As codebases grow in size and complexity, it is necessary to establish and maintain some kind of **style guide which each and every contributor should conform to**. While tools like ESLint and Prettier are able to support us in this regard, additional rules are needed to allow us to better communicate with each other. Since our community is coming from all around the world, working together in an asynchronous manner, **clear communication** is  of utmost importance.

The following set of conventions should make it easier for you to understand our code and aid you in making meaningful contributions to the project:

## Naming Conventions
Give your functions, components and files **speaking/self-explanatory names** (e.g. `getCollectionById()`, `KeyboardShortcuts.vue`, `setIdentity.ts`).
With a few exceptions, code and comments should be written in **english** only.

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
99% of the time your SCSS should be **scoped**, so it won't bleed outside of your component and pollute the global namespace!
```vue
<template>
    <div>
        ...
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ComponentOne } from '@/components/ComponentOne.vue'

interface InterfaceName {
  property: type
}

@Component({
  components: {
    ComponentOne
  },
})
export default class ComponentName extends Vue {}
</script>

<style scoped lang="scss"></style>
```

### Property Decorators
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
<MyCustomComponent :property-name="doSomething">
    {{ someProperty }}
</MyCustomComponent>
```

Use shorthands for vue attributes
- `:href` instead of `v-bind:href`
- `@click` instead of `v-on:click`
- ...

### Reusability Through Abstraction
If your component will be used on several occasions in many different contexts, you should think about the way you pass data to your components and the way events are handled.
In regards to event handling, you should always aim to emit events happening in your component, while the handling should be done in the parent or page itself. Thereby, the click of a button can trigger all kinds of functionality, without having to be aware of its context.
```vue
<template>
    <!-- ParentComponent.vue -->
    <ChildComponent @button-clicked="sendFormRequest" />
</template>
```
```vue
<template>
    <!-- ChildComponent.vue -->
    <div @click="$emit('@button-clicked')" />
</template>
```

Make reusable components as generic as possible. The naming should therefore only imply the functionality of component itself, and not what it does in the given context.
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