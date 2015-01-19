vood
====

lightweight mvc-framework with queries :3

api
---
```js
vood.controllerHelper.create('main/app' {
  filter: function(data) {
    this.set('items.@each.show', false');
    // sets all entities inside the array *items* with matching expression,
    // with the property *show* to true;
    this.set('items.propertyName==' + data.value +'.show', true);
    // you dont have to write it inside keyvalue, you can use the *query* property,
    // even with an array for an *Logic-OR*
    this.set('items.propertyName=={value}.show', true, {query: {value: ['foo', 'bar']}});
  }
});

vood.get('main/app'); // Returns all controllers matching the path
vood.get(1);          // Returns the controller with the id
vood.get('*');        // Returns all controllers


```
