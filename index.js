'use strict';
const str2fn = require('str2fn');

const register = function(server, options) {
  options.events.forEach(eventData => {
    server.events.on(eventData.event, async(data) => {
      try {
        const result = await str2fn.execute(eventData.method, server.methods, data);
        server.log(['hapi-method-events', eventData.method], result);
      } catch (err) {
        return server.log(err);
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
