# hapi-method-events

A [hapi](https://hapi.dev/) plugin that makes it easy to create
response handlers for server events

## Installation

```console
npm install hapi-method-events
```

## Usage


```javascript
const plugin = require('hapi-method-events');
const server = new hapi.Server({ });

// create a server event:
server.event('user.add');

// create one or more server methods to respond to the event:
server.method('userAddHandler', (string) => {
  console.log(string);
});
server.method('anotherUserAddHandler', (data) => {
  console.log(data.string2);
});

// register the plugin and specify server methods to call
// in the 'events' field
await server.register({
  plugin,
  options: {
    events: [{
      event: 'user.add',
      // notice that the method is specified as a string
      // and you can choose what value to pass to it
      // when the event is emitted:
      method: 'userAddHandler(data.string1)'
    },
    {
      event: 'user.add',
      method: 'anotherUserAddHandler(data)'
    }]
  }
});

// now call the event!
await server.events.emit('user.add', {
  data: {
    string1: 'Hello World!',
    string2: 'Hello Again!'
  }
});
```

## Options

- __events__ (required)

A list of events and methods to call for those events.  The events should be specified as string.

- __verbose__

In verbose mode, hapi-method-events will print out the events and command string being executed.
By default this is set to false.
