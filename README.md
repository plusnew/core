# plusnew [![Build Status](https://api.travis-ci.org/plusnew/plusnew.svg?branch=master)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew)

This Framework is build, because we believe that having typesafety and good debuggability are key.
Why another framework? Because plusnew puts the Developer-Expierence first, and cares strongly about maintanability.

Plusnew keeps the *magic* as little as possible, and puts explicity first.
E.G. when you write a line of code which changes the state, the dom will change immediately. This is important for predictability and testability.

## Component
Components in plusnew just need a name and a render-function,
the renderfunction gets called when a new instance of that component is created.
When new props from the parent, or stores are changing, the render function does not get called again. But only a subset that you can define with a closure.

### Component-Types
#### Function-Factory

```ts
import plusnew, { component } from 'plusnew';

type props = { foo: string };

export default component(
  // ComponentName for debuggability enhancements
  'ComponentName',
  // The renderfunction which gets called at initialisation
  // and gets a Observer-Component which delivers the properties from the parent
  (Props: Props<props>) =>
    <div>
      <Props render={props => props.foo} />
    </div>,
);

```

#### Class

```ts
import plusnew, { Component } from 'plusnew';

type props = { foo: string };

export default class AppComponent extends Component<props> {
  // ComponentName for debuggability enhancements
  static displayName: 'ComponentName';
  // The renderfunction which gets called at initialisation
  // and gets a Observer-Component which delivers the properties from the parent
  render(Props: Props<props>) {
    return (
      <div>
        <Props render={props => props.foo} />
      </div>
    );
  }
}


```

### Props
Props aren't given to you directly, but as a "observer-component".
This given component has a render-property which expects a renderfunction. This renderfunction is called each time when the state of your properties are being changed.
This way you have more control of what will be checked for rerender.

## Stores

Stores are used to persist your state and inform the components when the state changed.
They consist of the initialStateValue and a reducer function.

The reducer function gets called, when a new action gets dispatched.
This reducer gets the current state of the store and the action which just got dispatched. The new state will be that, what the reducer returns.

Each store has a Observer-Component, which expects a render function as a property.
When a store changes it's state, this renderfunction gets called.

```ts
import plusnew, { component, store } from 'plusnew';

const INITIAL_COUNTER_VALUE = 0;

export default component(
  'ComponentName',
  () => {
    const counter = store(INITIAL_COUNTER_VALUE, (previousStateValue, action: number) => previousStateValue + action);

    return (
      <div>
        <button
          onclick={(evt: MouseEvent) => counter.dispatch(1)}
        />
        <button
          onclick={(evt: MouseEvent) => counter.dispatch(2)}
        />
        <counter.Observer render={state =>
          // This function is the only part which gets executed on a state change
          <div>{state}</div>
        } />
      </div>
    );
  },
);

```
