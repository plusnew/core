# plusnew [![Build Status](https://travis-ci.org/plusnew/plusnew.svg)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg)](https://coveralls.io/github/plusnew/plusnew)

A typesecure framework for managing your components.
The Framework has a immutable statehandling approach, which allows easy timetraveling.

A Component can get data by it's props, and by unlimited internal and external stores.
This avoids nesting the component in containers for i18n and others.

```ts
import plusnew, { component, store } from 'plusnew';
import Counter from './Counter';

type actions = { type: 'store::init' | 'increment' };
type props = {};

const component: component<props> = function () {
  const local = new store((state: number, action: actions) => {
    if (action.type === 'store::init') {
      return 0;
    } else if (action.type === 'increment') {
      return ++state;
    }
    return state;
  });

  return {
    dependencies: { local },
    render: (props: props) => 
      <div>
        <button onClick={(evt: KeyboardEvent) => {
          local.dispatch({ type: 'increment' });
        }} />
        <Counter value={local.state} />
      </div>,
  };
};
```
