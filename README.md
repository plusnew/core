#snew [![Build Status](https://travis-ci.org/plusgut/snew.svg?branch=master)](https://travis-ci.org/plusgut/snew)

lightweight mvc-framework with local data quering
unlike other frameworks we don't render the whole template each time
data changed in your component. The Templating engine
[tempart](https://github.com/plusgut/tempart) notifies the view what
actually changed, without the need to diff between different states.

Note: don't use this framework yet, its in alpha state. Currently it's not robust, it has no XSS prevention and a lack of documentation.

api
---
```js
snew.Controller('main/app' {
  filter: function(data) {
    this.set('items.@each.show', false);
    // sets all entities inside the array items with matching expression,
    // with the property show to true;
    this.set('items.propertyName==' + data.value +'.show', true);

    // you dont have to write it inside keyvalue, you can use the query property,
    // even with an array for an Logic-OR
    this.set(['items', {propertyName: ['foo', 'bar']}, 'show'], true);
  }
});

```

```js
snew.View('main/app' {
  events: [{
    // Gets checked when dom-event is inside the context of the view
    selector: 'li',
    // Defines what-the eventtype is
    type: 'click',
    // what function should it try to call (can be inside the view and in the controller)
    action: 'filter'
  }]
});

```

```js
snew.search('main/app'); // Returns all controllers matching the path
snew.search(1);          // Returns the controller with the id
```

```js
this.remove(['todos', {completed: true}]); // Simple

// @TODO: get an api for AND / OR - the following is inconsistent
this.remove(['todos', {key: ['oneValue', 'anotherValue'], anotherKey: ['oneValue', 'anotherValue']}]); // AND
this.remove(['todos', [{key: ['oneValue', 'anotherValue']}, {anotherKey: ['oneValue', 'anotherValue']}]]); // OR
```
