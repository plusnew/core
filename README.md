# plusnew [![Build Status](https://api.travis-ci.org/plusnew/plusnew.svg?branch=master)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew)

This Framework is build, because we believe that having typesafety and good debuggability are key.
Why another framework? Because plusnew puts the Developer-Expierence first, and cares strongly about maintanability.

Plusnew keeps the *magic* as little as possible, and puts explicity first.
E.G. when you write a line of code which changes the state, the dom will change immediately. This is important for predictability and testability.

## Component
Components in plusnew just need a name and a render-function,
the renderfunction gets called when a new instance of that component is created.

When props from the parent, or stores are changing, the render function does not get called again. But only a subset that you can define with a closure.

### Component-Types
#### Function-Factory

```ts
import plusnew, { component, Props } from 'plusnew';

type props = { value: string };

export default component(
  // ComponentName for debuggability enhancements
  'ComponentName',
  // The renderfunction which gets called at initialisation
  // and gets a Observer-Component which delivers the properties from the parent
  (Props: Props<props>) =>
      <>
        <span>some static content</span>
        <Props render={props =>
          // in props.value is the value you got from your parent-component
          // this render-function gets called each time when the parent gives you new properties
          <div>{props.value}</div>
        } />
      </>
);
```

#### Class

```ts
import plusnew, { Component, Props } from 'plusnew';

type props = { value: string };

export default class AppComponent extends Component<props> {
  // ComponentName for debuggability enhancements
  static displayName: 'ComponentName';
  // The renderfunction which gets called at initialisation
  // and gets a Observer-Component which delivers the properties from the parent
  render(Props: Props<props>) {
    return (
      <>
        <span>some static content</span>
        <Props render={props =>
          // in props.value is the value you got from your parent-component
          // this render-function gets called each time when the parent gives you new properties
          <div>{props.value}</div>
        } />
      </>
    );
  }
}
```

### Props
The props-values aren't given to you directly, but as a "observer-component".

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
    const counter = store(INITIAL_COUNTER_VALUE, (previousState, action: number) => previousState + action);

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

## Helper-Components
### Portal
With portals you can render elements outside of your normal tree, but whereever you want.

```ts
import plusnew, { component, Portal } from 'plusnew';

export default component(
  'ComponentName',
  () =>
    <Portal target={document.getElementById('somewhere') as HTMLElement}>
      <div>your element is appended inside the #somewhere element</div>
    </Portal>,
);
```

### Animate
The Animate-Component can take care of dom-elements which were mounted and of dom-elements to be unmounted.
When a dom-element gets created the according elementDidMount or elementWillUnmount gets called, with the dom-element as a parameter.

Same goes for dom-elements which will get unmounted, simply return a resolved Promise when the animation is done and you want the dom-element to get actually be deleted.

Note: Dom-Elements inside Dom-Elements will not trigger the callbacks, only the most outer dom-elements will trigger the callback.

```ts
import plusnew, { component, Animate, store } from 'plusnew';

export default component(
  'ComponentName',
  () => {
    const show = store(true, (previousState, action: boolean) => action);

    return (
      <Animate
        elementDidMount={(element) => {
          // For example you can call the Element.animate function
          // https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
          element.animate([{ opacity: '0' }, { opacity: '1' }], { duration: 3000 })
        }}
        elementWillUnmount={(element) => {
          // either return undefined, to delete the element immediately or a promise
          // e.g. https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished
          return element.animate([{ opacity: '1' }, { opacity:  '0' }], { duration: 3000 }).finished;
        }}
      >
        <show.Observer render={state =>
          // When this button gets created it calls the elementDidMount
          // when it gets deleted the elementWillUnmount gets called beforehand 
          state === true && <button onclick={() => show.dispatch(false)}>Remove me :)</button>
        } />
      </Animate>
    );
  },
);
```

### Async
The Async-Component is used for displaying asynchronous content.
Return as a promise, and it will show the loading content, until the promise got resolved.

For example you can implement that a dom element gets created after a period of time, or you can lazyload another module and display it when it got loaded.
The given Promise should get resolved with an JSX-Element you want to show.

Note: it is necessary that the promise gets resolved and not rejected, it is recommended to catch your own promise.

```ts
import plusnew, { component, Async } from 'plusnew';

export default component(
  'ComponentName',
  () =>
        <Async
          render={() =>
            import('path/to/lazy/module')
              .then(module => <module.default />)
              .catch(() => <span>Could not load the module</span>)
          }
          pendingIndicator={<span>Loading asynchronously a module</span>}
        />,
);
```
