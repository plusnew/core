# plusnew [![Build Status](https://travis-ci.org/plusnew/plusnew.svg?branch=v0.5)](https://travis-ci.org/plusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew/badge.svg?branch=v0.5)](https://coveralls.io/github/plusnew/plusnew?branch=v0.5)

A typesecure framework for managing your components.
The Framework has a immutable statehandling approach, which allows easy timetraveling.

A Component can get data by it's props, and by unlimited internal and external stores.
This avoids nesting the component in containers for i18n and others.

```ts
import plusnew, { component, store, LifeCycleHandler } from 'plusnew';
import Todo from './Todo';

interface props {}

interface actionInit {
  type: 'init';
}

interface actionAdd {
  type: 'add';
  payload: string;
}

const component: component<props> = function (lifeCycleHandler: LifeCycleHandler) {

  const local = new store((localState: { list: string[] }, action: actionInit | actionAdd) => {
    if (action.type === 'init') {
      return {
        list: ['foo', 'bar', 'baz'],
      };
    } else if (action.type === 'add') {
      return {
        list: [...localState.list, action.payload],
      };
    }
    return localState;

  }).addOnChange(lifeCycleHandler.componentCheckUpdate).dispatch({ type: 'init' });

  return (props: props) =>
    <div>
      <input type="text" onChange={(evt: KeyboardEvent) => {
        local.dispatch({ type: 'add', payload: evt.target.value });
      }} />
      <ul>
        {local.state.list.map((item, index) =>
          <Todo key={index} value={item} />,
        )}
      </ul>
    </div>;
};

export default component;
```