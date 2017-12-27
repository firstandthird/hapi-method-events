const tap = require('tap');
const hapi = require('hapi');
const plugin = require('../index.js');

tap.test('will call functions on a named event with the correct parameters', async t => {
  const server = new hapi.Server({
    debug: { log: ['hapi-method-events'] },
  });
  t.plan(2);
  server.event('user.add');
  await server.register({
    plugin,
    options: {
      events: {
        'user.add': [
          'addToMailchimp(user._id)',
          'addtoBlah()'
        ]
      }
    }
  });
  let count = 0;
  server.method('addToMailchimp', (id, callback) => {
    t.equal(id, 'Grape Ape');
    return callback(null, '1');
  });
  server.method('addtoBlah', (callback) => {
    count++;
    return callback();
  });
  await server.start();
  await server.events.emit('user.add', {
    user: {
      _id: 'Grape Ape'
    }
  });
  t.equal(count, 1);
  await server.stop();
  t.end();
});
