# plusnew [![Build Status](https://travis-ci.org/plusnew/plusnew.svg)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg)](https://coveralls.io/github/plusnew/plusnew)

A typesecure framework for managing your components.
The Framework has a immutable statehandling approach, which allows easy timetraveling.

A Component can get data by it's props, and by unlimited internal and external stores.
This avoids nesting the component in containers for i18n and others.

```ts
import plusnew, { component, store, LifeCycleHandler } from 'plusnew';
import Counter from './Counter';

type actions = { action: 'store::init' | 'increment' };

const component: component<{}, {local: store<number, actions>}> = function () {
  return (props: props) => {
    render: () => 
      <div>
        <button onClick={(evt: KeyboardEvent) => {
          local.dispatch({ type: 'increment' });
        }} />
        <Counter value={local.state} />
      </div>,
    dependencies: {
      local: new store((state: number, action: actions) => {
        if (action.type === 'init') {
          return 0;
        } else if (action.type === 'increment') {
          return ++state;
        }
        return state;
      })
    }
  }
};

export default component;
```