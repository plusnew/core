# plusnew [![Build Status](https://api.travis-ci.org/plusnew/plusnew.svg?branch=master)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew)

A typesecure framework for managing your components.
The Framework has a immutable statehandling approach, which allows easy timetraveling.

A Component can get data by it's props, and by unlimited internal and external stores.
This avoids nesting the component in containers for i18n and others.

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
