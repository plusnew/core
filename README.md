snew
====

lightweight mvc-framework with queries :3
unlike other frameworks we don't render the whole template each time
data changed in your component. The Templating engine
[tempart](https://github.com/plusgut/tempart) notifies the view what
actually changed, without the need to diff between different states.

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

snew.search('main/app'); // Returns all controllers matching the path
snew.search(1);          // Returns the controller with the id
snew.search('@each');    // Returns all controllers


```
