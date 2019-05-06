const tap = require('tap');
const hapi = require('@hapi/hapi');
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
      events: [{
        event: 'user.add',
        method: 'addToMailchimp(user._id)'
      },
      {
        event: 'user.add',
        method: 'addtoBlah()'
      }]
    }
  });
  let count = 0;
  server.method('addToMailchimp', id => {
    t.equal(id, 'Grape Ape');
    return '1';
  });
  server.method('addtoBlah', () => {
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

tap.test('will call functions on an event registered with an object', async t => {
  const server = new hapi.Server({
    debug: { log: ['hapi-method-events'] },
  });
  t.plan(1);
  await server.register({
    plugin,
    options: {
      events: [{
        event: { channels: 'error', name: 'request' },
        method: 'addToMailchimp()'
      }]
    }
  });
  let count = 0;
  server.method('addToMailchimp', id => {
    count++;
    return '1';
  });
  await server.start();
  server.route({
    path: '/',
    method: 'get',
    handler(request, h) {
      throw new Error('death');
    }
  })
  await server.inject({ url: '/' });
  t.equal(count, 1);
  await server.stop();
  t.end();
});

tap.test('will report errors when thrown', async t => {
  const server = new hapi.Server({
    debug: { log: ['hapi-method-events'] },
  });
  t.plan(1);
  let called = false;
  server.events.on('log', (input) => {
    called = input;
  });
  await server.register({
    plugin,
    options: {
      events: [{
        event: { channels: 'error', name: 'request' },
        method: 'blahblahblahNo(user._id)'
      }]
    }
  });
  await server.start();
  server.route({
    path: '/',
    method: 'get',
    handler(request, h) {
      throw new Error('death');
    }
  })
  await server.inject({ url: '/' });
  t.deepEqual(Object.keys(called), ['timestamp', 'tags', 'error', 'channel']);
  await server.stop();
  t.end();
});
