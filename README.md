# plusnew [![Build Status](https://travis-ci.org/pluplusnew/plusnew.svg)](https://travis-ci.org/pluplusnew/plusnew) [![Coverage Status](https://coveralls.io/repos/github/pluplusnew/plusnew/badge.svg)](https://coveralls.io/github/pluplusnew/plusnew)

lightweight mvc-framework with local data quering
unlike other frameworks we don't render the whole template each time
data changed in your component. The Templating engine
[tempart](https://github.com/pluplusnew/tempart) gets notified from the view what
actually changed, without the need to diff between states.

Our focus is to be just a small layer and don't take debuggability away. When an error happens, your exceptions will get triggered as expected and no weird voodoo is happening.

As a framework we don't want to force you what technology you use in your application. We handle plain old javascript.

Note: don't use this framework yet, its in alpha state. Currently it's not robust, it has no XSS prevention and a lack of documentation.

## api

```js

// Classes are of course possible as well, plusnew doesn't restrict you in any way
app.components['main/app'] = function (state props) {
  this.state = state;
  this.props = props;
  
  this.state.todos = [{label: 'foo'}]
};

app.components['main/app'].prototype = {
  addTodo: function(label) {
    // The template is subscribed to changes in the array, and gets the event that there is a new entity and updates the dom
    this.state.todos.push({label}); 
  }
});

```
