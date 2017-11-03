# plusnew [![Build Status](https://travis-ci.org/plusnew/plusnew.svg?branch=v0.5)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=v0.5)](https://coveralls.io/github/plusnew/plusnew?branch=v0.5)

A typesecure framework for managing your components.
The Framework has a immutable statehandling approach, which allows easy timetraveling.

A Component can get data by it's props, and by unlimited internal and external stores.
This avoids nesting the component in containers for i18n and others.

```ts
import plusnew, { component, store, LifeCycleHandler } from 'plusnew';
import Counter from './Counter';

const component: component<{}> = function (lifeCycleHandler: LifeCycleHandler) {

  const local = new store((state: number, action: {type: 'init' | 'increment'}) => {
    if (action.type === 'init') {
      return 0;
    } else if (action.type === 'increment') {
      return ++state;
    }
    return state;
  }).addOnChange(lifeCycleHandler.componentCheckUpdate).dispatch({ type: 'init' });

  return (props: props) =>
    <div>
      <button onClick={(evt: KeyboardEvent) => {
        local.dispatch({ type: 'increment' });
      }} />
      <Counter value={local.state} />
    </div>;
};

export default component;
```