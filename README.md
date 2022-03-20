# Straightforward State

A state object that is conditionally watchable on first depth only.

## Install:

```
npm i -s straigtforward-state
```

or

```
yarn add straigtforward-state
```

## import or require

```js
import state from "straightforward-state";
```

or

```js
const state = require("straightforward-state");
```

## Initialize

```js
state.set = { things: [1,2,3], others: [3,4,5], numberOfThings: 6 };
```

or


```js
state.set({ things: [1,2,3], numberOfThings: 3 });
```

## Access

Access values as usual

```js
state.things // [1,2,3]
state.numberOfThings // 3
```

## Set
Set the state properties as usual. When set watchers will be run, mutations does not trigger however, like pushing to an array value.
```js
state.things = [...state.things, 4];
```

## Watch
```js
state.watch.things = (val, was) => {
  val // [1,2,3,4]
  state.things // [1,2,3,4]

  state.numberOfThings = state.things.length;
};

state.watch.numberOfThings((val, was) => {
  val // 4
  was // 3
});
```




