# snew [![Build Status](https://travis-ci.org/plusgut/snew.svg?branch=v0.3)](https://travis-ci.org/plusgut/snew) [![Coverage Status](https://coveralls.io/repos/github/plusgut/snew/badge.svg?branch=v0.3)](https://coveralls.io/github/plusgut/snew?branch=v0.3)

lightweight mvc-framework with local data quering
unlike other frameworks we don't render the whole template each time
data changed in your component. The Templating engine
[tempart](https://github.com/plusgut/tempart) gets notified from the view what
actually changed, without the need to diff between states.

Our focus is to be just a small layer and don't take debuggability away. When an error happens, your exceptions will get triggered as expected and no weird voodoo is happening.

As a framework we don't want to force you what technology you use in your application. We handle plain old javascript.

Note: don't use this framework yet, its in alpha state. Currently it's not robust, it has no XSS prevention and a lack of documentation.

## api
```js
app.components['main/app'] = function (snew, props) {
  this.s = snew;
  this.props = props;
};

app.components['main/app'].prototype = {
  filter: function(data) {
    // remove all entities with the property completed === true
    this.s.remove(['todos', {completed: true}]); // Simple
  }
});

```
