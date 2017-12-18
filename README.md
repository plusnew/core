# plusnew [![Build Status](https://api.travis-ci.org/plusnew/plusnew.svg?branch=master)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew)

A typesecure framework for managing your components.
The Framework has a immutable statehandling approach, which allows easy timetraveling.

A Component can get data by it's props, and by unlimited internal and external stores.
This avoids nesting the component in containers for i18n and others.

```ts
import plusnew, { component, store } from 'plusnew';
import Counter from './Counter';

type actions = { type: 'store::init' | 'increment' };
type props = {};

const reducer = (state: number | null, action: actions) => {
  if (state === null) {
    return 0;
  }
  if (action.type === 'increment') {
    return state + 1;
  }
  return state;
};

const component: component<props> = () => {
  const local = store(reducer);

  return {
    dependencies: { local },
    render: (props: props) =>
      <div>
        <button
          onClick={(evt: KeyboardEvent) => local.dispatch({ type: 'increment' })}
        />
        <Counter value={local.state} />
      </div>,
  };
};

export default component;


```
