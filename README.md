# Straightforward State
[![Percentage of issues still open](http://isitmaintained.com/badge/open/malipetek/straightforward-state.svg)](http://isitmaintained.com/project/malipetek/straightforward-state "Percentage of issues still open")
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/malipetek/straightforward-state.svg)](http://isitmaintained.com/project/malipetek/straightforward-state "Average time to resolve an issue")


[![GitHub stars](https://img.shields.io/github/stars/malipetek/straightforward-state.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/malipetek/straightforward-state/stargazers/)

[![Npm package total downloads](https://badgen.net/npm/v/@malipetek/straightforward-state)](https://npmjs.com/package/v/@malipetek/straightforward-state)
[![Npm package total downloads](https://badgen.net/npm/dt/@malipetek/straightforward-state)](https://npmjs.com/package/dt/@malipetek/straightforward-state)

[![Npm package total downloads](https://badgen.net/packagephobia/publish/@malipetek/straightforward-state)](https://badgen.net/packagephobia/publish/@malipetek/straightforward-state)

[![Npm package total downloads](https://badgen.net/npm/types/@malipetek/straightforward-state)](https://badgen.net/npm/types/@malipetek/straightforward-state)


A state object that is conditionally watchable on first depth only.

## Play
### On codesandbox: 
[![Edit magical-wilbur-f247um](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/magical-wilbur-f247um?fontsize=14&hidenavigation=1&theme=dark)
### On Stackblitz:
[Edit on Stackblitz](https://stackblitz.com/edit/js-gc4vuk?file=index.js)
## Install:

```
npm i -s @malipetek/straigtforward-state
```

or

```
yarn add @malipetek/straigtforward-state
```

## import or require

```js
import state from "@malipetek/straigtforward-state";
```

or

```js
const state = require("@malipetek/straigtforward-state");
```

Alternatively you can get instances like this:

```js
import { newState } from "@malipetek/straigtforward-state";
const state1 = newState();
const state2 = newState();
```
## Initialize

```js
state.set = { things: [1,2,3], numberOfThings: 6, aLotOfThings: false };
```

or


```js
state.set({ things: [1,2,3], numberOfThings: 3, aLotOfThings: false });
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
### Watch a member
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
### Watch All
```js
state.watch.all = (changedKey, val, was) => {
  changedKey // 'things', 'numberOfThings'
  state[changedKey] // [1], 1
  val // [1], 1
  was // [1,2,3], 3
};

state.things = [1];
state.numberOfThings = 1;
```
## Conditional watch
```js
state.when.things.watch.numberOfThings(callback);
// or
const newThings = [1,2];
state.when.things.is(newThings).watch.numberOfThings = (val, was) => {
  val // === newThings
};
state.things = newThings;
```

## *and*, *or* Operators
```js
state.when.numberOfThings.or.aLotOfThings.watch.things((val, was) => {

});

state.when.numberOfThings.and.aLotOfThings.watch.things = (val, was) => {
  // fires once
};

state.things = [1,2,3,4];

state.aLotOfThings = true;

state.things = [1,2,3,4];
```

## *is* operator
Is operator can take a value or a function with 1 param that is *the state member*.
```js
state.when.numberOfThings.is(v => v.length > 6).and.aLotOfThings.is(false).watch.things((things) => {
  state.aLotOfThings = true;
});

state.things = [1,2,3,4,5,6,7,8];
```

## *more* and *less* operators
*more* and *less* operators only can be used after is fn call followed by a *or*.
```js
state.when.numberOfThings.is(6).or.more.watch.things(callback);
```

👉 [Submit feedback](mailto:malipetek@gmail.com?subject=About%20Straightforward%20State%20Package&body=Hi%2C%20I%20checked%20this%20package%20and%20...)

👉 [Submit issues](https://github.com/malipetek/straightforward-state/issues)




