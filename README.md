# plusnew [![Build Status](https://api.travis-ci.org/plusnew/plusnew.svg?branch=master)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew)

This Framework is build, because we believe that having typesecurity and good debuggability are key.
Why another framework? Because plusnew puts the Developer-Expierence first, and cares strongly about maintanability.

Plusnew keeps the *magic* as little as possible, and puts explicity first.
E.G. when you write a line of code which changes the state, the dom will change immediately. This is important for predictability and testability.

```ts
import plusnew, { component, store, Props } from 'plusnew';
import Panel from './Panel';

const INITIAL_COUNTER_VALUE = 0;

export default component(
  // ComponentName for debuggability enhancements
  'ComponentName',
  // The renderfunction which gets called at initialisation
  // and gets a Consumer-Component which delivers the properties from the parent
  (Props: Props<{value: string}>) => {
    const counter = store(INITIAL_COUNTER_VALUE, (state, action: number) => state + action);

    return (
      <div>
        <button
          onclick={(evt: MouseEvent) => counter.dispatch(1)}
        />
        <button
          onclick={(evt: MouseEvent) => counter.dispatch(2)}
        />
        <counter.Observer render={state => {
          // This function is the only part which gets executed on a state change
          <Panel value={state} />
        }} />

        // This render function is the only part which gets executed on a property change
        <Props render={props => props.value} />
      </div>,
    );
  },
);

```
