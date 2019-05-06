'use strict';
const str2fn = require('str2fn');

const register = function(server, options) {
  options.events.forEach(eventData => {
    server.events.on(eventData.event, async(data) => {
      const eventName = typeof eventData.event === 'object' ? eventData.event.name : eventData.event;
      try {
        const result = await str2fn(eventData.method, server.methods, data);
        if (options.verbose) {
          server.log(['hapi-method-events', eventName, eventData.method], result);
        }
      } catch (err) {
        return server.log(['hapi-method-events', eventName, eventData.method], err);
      }
    });
  });
};

exports.plugin = {
  name: 'hapi-method-events',
  register,
  once: true,
  pkg: require('./package.json')
};
