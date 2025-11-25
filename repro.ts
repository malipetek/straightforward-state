import { newState } from './index';

// No explicit type needed!
const state = newState()
  .set({ count: 1 })
  .set({ status: 'active' })
  .set({ a: 'aasd' });

// Valid usage - Types should be inferred
state.when.count.is(10).watch.status = (val) => { console.log(val); };
state.when.status.is('idle').or.count.is(0).watch.count = (val) => { console.log(val); };
state.when.count.is(5).or.more.watch.status = (val) => { console.log(val); };

// Invalid usage (uncomment to see errors if not using @ts-expect-error)
// @ts-expect-error
state.when.invalidProp;
// @ts-expect-error
state.when.count.is('string');

console.log(state.count);
console.log(state.status);
console.log(state.a);
