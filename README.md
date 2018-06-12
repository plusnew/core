# plusnew [![Build Status](https://api.travis-ci.org/plusnew/plusnew.svg?branch=master)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew)

This Framework is build, because we believe that having typesecurity and the functional paradigm is the right way.
Why another framework? Because plusnew puts the Developer-Expierence first, and cares strongly about maintanability.

Plusnew keeps the *magic* as little as possible, and puts explicity first.
E.G. when you write a line of code which changes the state, the dom will change immediately. This is important for predictability and testability.

```ts
import plusnew, { component, store } from 'plusnew';
import Counter from './Counter';

const INITIAL_COUNTER_VALUE = 0;

export default component(
  // ComponentName for debuggability enhancements
  'ComponentName',
  // Function who returns all dependencies, when the component should rerender
  () => ({
    counter:  store(INITIAL_COUNTER_VALUE, (state, action: number) => state + action)
  }),

  // The actual stateless renderfunction
  (props: {}, { counter }) =>
    <div>
      <button
        onclick={(evt: MouseEvent) => counter.dispatch(1)}
      />
      <button
        onclick={(evt: MouseEvent) => counter.dispatch(2)}
      />
      <Counter value={counter.state} />
    </div>,
);

```
