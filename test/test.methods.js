const tap = require('tap');
const hapi = require('hapi');
const plugin = require('../index.js');

tap.test('will call functions on a given event with the correct parameters', async t => {
  const server = new hapi.Server({});
  t.plan(2);
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
  server.method('addToMailchimp', async(id) => {
    t.equal(id, 'Grape Ape');
    return id;
  });
  server.method('addtoBlah', async() => {
    count++;
    return;
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
