# plusnew [![Build Status](https://api.travis-ci.org/plusnew/plusnew.svg?branch=master)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew)

A typesecure framework for managing your components.
The Framework has a immutable statehandling approach, which allows easy timetraveling.

A Component can get data by it's props, and by unlimited internal and external stores.
This avoids nesting the component in containers for i18n and others.

```ts
import plusnew, { component, store } from 'plusnew';
import Counter from './Counter';

type props = {};

const component: component<props> = () => {
  const local = store(0, state: number => state + 1)();

  return {
    dependencies: { local },
    render: (props: props) =>
      <div>
        <button
          onClick={(evt: KeyboardEvent) => local.dispatch()}
        />
        <Counter value={local.state} />
      </div>,
  };
};

export default component;

```
